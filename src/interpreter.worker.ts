import { tokenize } from "./tokenizer.js";
import { parse } from "./parser.js";
import { Interpreter, InputRequestError } from "./interpreter.js";
import type { WorkerMessage, WorkerResponse, ASTNode } from "../types/index.js";

let interpreter: Interpreter | null = null;
let ast: ASTNode[] = [];
let steppingMode = false;
let inputResolve: ((value: string) => void) | null = null;
let currentExecIndex = 0;
let breakpoints: Set<number> = new Set();

function respond(msg: WorkerResponse) {
  (self as unknown as Worker).postMessage(msg);
}

function handleInputError(e: InputRequestError) {
  respond({ type: "input_request", prompt: e.prompt });
  inputResolve = (value: string) => {
    if (e.args && e.args.length > 0) {
      const parts = value.split(/[,;]/).map((v) => v.trim());
      e.args.forEach((varName, i) => {
        if (varName && interpreter) {
          const raw = parts[i] ?? "";
          let parsed: unknown = raw;
          const existing = interpreter!.variables.get(varName);
          if (typeof existing === "string") {
            parsed = raw;
          } else if (typeof existing === "boolean") {
            if (raw === "verdadeiro" || raw === "true") parsed = true;
            else if (raw === "falso" || raw === "false") parsed = false;
            else parsed = Boolean(raw);
          } else if (typeof existing === "number") {
            if (raw === "verdadeiro" || raw === "true") parsed = 1;
            else if (raw === "falso" || raw === "false") parsed = 0;
            else if (!isNaN(Number(raw)) && raw !== "") parsed = Number(raw);
            else parsed = 0;
          } else {
            if (raw === "verdadeiro" || raw === "true") parsed = true;
            else if (raw === "falso" || raw === "false") parsed = false;
            else if (!isNaN(Number(raw)) && raw !== "") parsed = Number(raw);
          }
          interpreter.variables.set(varName, parsed);
        }
      });
      interpreter!.console.push({
        id: Date.now(),
        text: value,
        type: "input",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: false }),
      });
    } else {
      interpreter!.console.push({
        id: Date.now(),
        text: e.prompt ? e.prompt + value : value,
        type: "input",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: false }),
      });
    }
    respond({
      type: "state_update",
      state: interpreter!.getState(),
    });
  };
}

function execAllNodes(nodes: ASTNode[]) {
  for (let i = currentExecIndex; i < nodes.length; i++) {
    currentExecIndex = i;
    const line = nodes[i].line;
    
    // Check for breakpoint (only if not stepping)
    if (!steppingMode && breakpoints.has(line)) {
      steppingMode = true;
      respond({
        type: "state_update",
        state: { ...interpreter!.getState(), status: "paused" },
      });
      return;
    }
    
    try {
      interpreter!.execNode(nodes[i]);
      respond({
        type: "state_update",
        state: interpreter!.getState(),
      });
    } catch (e) {
      if (e instanceof InputRequestError) {
        handleInputError(e);
        return;
      }
      respond({
        type: "error",
        message: (e as Error).message,
        line: interpreter!.currentLine,
      });
      return;
    }
  }
  respond({ type: "finished" });
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;

  switch (msg.type) {
    case "run": {
      steppingMode = false;
      currentExecIndex = 0;
      breakpoints = new Set(msg.breakpoints ?? []);
      try {
        const tokens = tokenize(msg.code);
        ast = parse(tokens);
        interpreter = new Interpreter({
          debugMode: msg.debugMode ?? false,
          timeoutMs: msg.timeoutMs ?? 0,
          maxCallStackDepth: msg.maxRecursion ?? 100,
          maxLoopIterations: msg.maxLoopIterations ?? 10000,
          maxIterations: msg.maxIterations ?? 1000000,
        });
        respond({
          type: "state_update",
          state: interpreter.getState(),
        });
        execAllNodes(ast);
      } catch (err) {
        respond({
          type: "error",
          message: (err as Error).message,
          line: 0,
        });
      }
      break;
    }

    case "step": {
      steppingMode = true;
      currentExecIndex = 0;
      breakpoints = new Set(msg.breakpoints ?? []);
      try {
        if (ast.length === 0) {
          const tokens = tokenize(msg.code);
          ast = parse(tokens);
          interpreter = new Interpreter();
        }
        if (!interpreter) {
          interpreter = new Interpreter();
        }
        // Execute first node
        if (ast.length > 0) {
          interpreter.execNode(ast[0]);
          respond({
            type: "state_update",
            state: interpreter.getState(),
          });
          if (ast.length === 1) {
            respond({ type: "finished" });
          }
        }
      } catch (err) {
        if (err instanceof InputRequestError) {
          handleInputError(err);
        } else {
          respond({
            type: "error",
            message: (err as Error).message,
            line: interpreter?.currentLine ?? 0,
          });
        }
      }
      break;
    }

    case "continue": {
      if (inputResolve) {
        const resolve = inputResolve;
        inputResolve = null;
        resolve(msg.value ?? "");
        // Mark input as resolved and store the value for capturar() to return
        if (interpreter) {
          interpreter.inputResolved = true;
          // Parse the input value
          let parsedValue: unknown = msg.value ?? "";
          if (msg.value === "verdadeiro" || msg.value === "true") parsedValue = true;
          else if (msg.value === "falso" || msg.value === "false") parsedValue = false;
          else if (!isNaN(Number(msg.value)) && msg.value !== "") parsedValue = Number(msg.value);
          interpreter.lastInputValue = parsedValue;
        }
      }
      if (!steppingMode && interpreter && ast.length > 0) {
        // Continue executing remaining nodes after input
        currentExecIndex++;
        execAllNodes(ast);
      } else if (steppingMode && interpreter && ast.length > 0) {
        // Step one node using currentExecIndex
        currentExecIndex++;
        if (currentExecIndex >= ast.length) {
          respond({ type: "finished" });
          break;
        }
        try {
          const node = ast[currentExecIndex];
          interpreter.execNode(node);
          respond({
            type: "state_update",
            state: interpreter.getState(),
          });
        } catch (err) {
          if (err instanceof InputRequestError) {
            handleInputError(err);
          } else {
            respond({
              type: "error",
              message: (err as Error).message,
              line: interpreter?.currentLine ?? 0,
            });
          }
        }
      }
      break;
    }

    case "stop": {
      interpreter = null;
      ast = [];
      steppingMode = false;
      inputResolve = null;
      respond({
        type: "state_update",
        state: {
          variables: {},
          currentLine: 0,
          console: [],
          status: "idle",
        },
      });
      break;
    }

    case "input_response": {
      if (inputResolve) {
        const resolve = inputResolve;
        inputResolve = null;
        resolve(msg.value);
        // Mark input as resolved and store the value for capturar() to return
        if (interpreter) {
          interpreter.inputResolved = true;
          // Parse the input value
          let parsedValue: unknown = msg.value;
          if (msg.value === "verdadeiro" || msg.value === "true") parsedValue = true;
          else if (msg.value === "falso" || msg.value === "false") parsedValue = false;
          else if (!isNaN(Number(msg.value)) && msg.value !== "") parsedValue = Number(msg.value);
          interpreter.lastInputValue = parsedValue;
        }
      }
      // Don't increment currentExecIndex - the current node (var_decl with capturar())
      // needs to be re-executed since the value was just assigned via inputResolve
      if (!steppingMode && interpreter && ast.length > 0) {
        execAllNodes(ast);
      }
      break;
    }
  }
};
