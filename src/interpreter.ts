import type {
  ASTNode,
  ExprNode,
  ConsoleLine,
  FunctionDeclNode,
} from "../types/index.js";
import { defaultValueForType } from "./utils.js";
import { RuntimeError } from "./errors.js";

export class InputRequestError extends Error {
  prompt: string;
  args: string[];

  constructor(prompt: string, args: string[]) {
    super("Solicitação de entrada");
    this.name = "InputRequestError";
    this.prompt = prompt;
    this.args = args;
  }
}

export class ReturnSignal extends Error {
  value: unknown;
  constructor(value: unknown) {
    super("retorno");
    this.name = "ReturnSignal";
    this.value = value;
  }
}

export class BreakSignal extends Error {
  constructor() {
    super("pare");
    this.name = "BreakSignal";
  }
}

export class ContinueSignal extends Error {
  constructor() {
    super("continua");
    this.name = "ContinueSignal";
  }
}

interface UserFunction {
  decl: FunctionDeclNode;
}

function getTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
}

export class Interpreter {
  variables: Map<string, unknown> = new Map();
  constants: Set<string> = new Set();
  functions: Map<string, UserFunction> = new Map();
  console: ConsoleLine[] = [];
  currentLine: number = 0;
  currentExecIndex: number = 0;
  maxIterations: number = 1000000;
  maxLoopIterations: number = 10000;
  iterationCount: number = 0;
  outputBuffer: string = "";
  callStack: string[] = [];
  private nextId: number = 0;

  execNode(node: ASTNode): void {
    this.currentLine = node.line;
    this.iterationCount++;

    if (this.iterationCount > this.maxIterations) {
      throw new RuntimeError(
        node.line,
        `Programa excedeu o limite de ${this.maxIterations} passos de execução. Verifique se não há loops infinitos ou recursão infinita.`
      );
    }

    switch (node.kind) {
      case "var_decl": {
        const value = this.evalExpr(node.expr);
        // Pre-allocate array with declared dimensions if no initializer
        if (node.dimensions && node.dimensions.length > 0 && Array.isArray(value) && value.length === 0) {
          const dims = node.dimensions.map((d) => this.evalExpr(d) as number);
          this.variables.set(node.name, this.createArray(dims));
        } else {
          this.variables.set(node.name, value);
        }
        if (node.isConstant) {
          this.constants.add(node.name);
        }
        break;
      }
      case "assign": {
        const target = node.name;
        if (this.constants.has(target)) {
          throw new RuntimeError(node.line, `Não é possível alterar a constante '${target}'`, 'Constantes não podem ser reatribuídas.', 'constante PI = 3.14\nmostrar(PI)');
        }
        if (!this.variables.has(target)) {
          throw new RuntimeError(node.line, `Variável '${target}' não declarada`, 'Declare a variável antes de usar.', `inteiro ${target} = 0`);
        }
        const value = this.evalExpr(node.expr);
        this.variables.set(target, value);
        break;
      }
      case "array_assign": {
        let current: unknown = this.variables.get(node.name);
        if (!Array.isArray(current)) {
          throw new RuntimeError(node.line, `'${node.name}' não é um array`, 'Use um vetor para acessar por índice.', 'inteiro vetor[3] = [1, 2, 3]\nmostrar(vetor[0])');
        }
        // Traverse to the target through all indices except the last
        for (let d = 0; d < node.indices.length - 1; d++) {
          const idx = this.evalExpr(node.indices[d]);
          if (typeof idx !== "number" || !Number.isInteger(idx)) {
            throw new RuntimeError(node.line, 'Índice inválido', 'Use um número inteiro como índice.', 'vetor[0]');
          }
          if (!Array.isArray(current) || idx < 0 || idx >= current.length) {
            throw new RuntimeError(node.line, `Índice ${idx} fora dos limites (tamanho: ${Array.isArray(current) ? current.length : 0})`, `Use um índice entre 0 ${(Array.isArray(current) ? `e ${current.length - 1}` : '')}.`, `${node.name}[0]`);
          }
          current = current[idx];
        }
        // Set value at the last index
        const lastIdx = this.evalExpr(node.indices[node.indices.length - 1]);
        if (typeof lastIdx !== "number" || !Number.isInteger(lastIdx)) {
          throw new RuntimeError(node.line, 'Índice inválido', 'Use um número inteiro como índice.', 'vetor[0]');
        }
        if (!Array.isArray(current) || lastIdx < 0 || lastIdx >= current.length) {
          throw new RuntimeError(node.line, `Índice ${lastIdx} fora dos limites (tamanho: ${Array.isArray(current) ? current.length : 0})`, `Use um índice entre 0 ${(Array.isArray(current) ? `e ${current.length - 1}` : '')}.`, `${node.name}[0]`);
        }
        (current as unknown[])[lastIdx] = this.evalExpr(node.expr);
        break;
      }
      case "print": {
        this.flushBuffer();
        const parts = node.args.map((arg) => this.formatValue(this.evalExpr(arg)));
        this.console.push({ id: this.nextId++, text: parts.join(""), type: "output", timestamp: getTimestamp() });
        break;
      }
      case "call": {
        this.execCall(node.callee, node.args, node.line);
        break;
      }
      case "input": {
        const varNames = node.args.map((a) => (a.kind === "identifier" ? a.name : ""));
        const promptText = varNames.length > 0 ? "> " : "";
        throw new InputRequestError(promptText, varNames);
      }
      case "if": {
        // Evaluate branches in order (se, senao se, senao se, ...)
        let executed = false;
        for (const branch of node.branches) {
          const cond = this.evalExpr(branch.condition!);
          if (cond) {
            this.execBlock(branch.body);
            executed = true;
            break;
          }
        }
        if (!executed && node.elseBranch) {
          this.execBlock(node.elseBranch);
        }
        break;
      }
      case "while": {
        let iterations = 0;
        while (this.evalExpr(node.condition)) {
          if (iterations >= this.maxLoopIterations) {
            throw new RuntimeError(node.line, `Limite de ${this.maxLoopIterations} iterações excedido no 'enquanto'`, 'Verifique se há uma condição de saída no loop.', 'enquanto (x < 10) faca\n  x = x + 1\nfimEnquanto');
          }
          try {
            this.execBlock(node.body);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) { iterations++; continue; }
            throw e;
          }
          iterations++;
        }
        break;
      }
      case "for": {
        const start = this.evalExpr(node.start) as number;
        this.variables.set(node.varName, start);
        if (node.condition) {
          // C-style for: condition is a boolean expression (e.g. i < 5)
          let iterations = 0;
          while (this.evalExpr(node.condition)) {
            if (iterations >= this.maxLoopIterations) {
              throw new RuntimeError(node.line, `Limite de ${this.maxLoopIterations} iterações excedido no 'para'`, 'Verifique se o loop tem uma condição de parada.', 'para (inteiro i = 0; i < 10; i = i + 1) faca\n  ...\nfimPara');
            }
            try {
              this.execBlock(node.body);
            } catch (e) {
              if (e instanceof BreakSignal) break;
              if (e instanceof ContinueSignal) {
                if (node.update) this.execNode(node.update);
                iterations++;
                continue;
              }
              throw e;
            }
            if (node.update) this.execNode(node.update);
            iterations++;
          }
        } else {
          // Legacy for: end is a numeric bound
          const end = this.evalExpr(node.end) as number;
          const stepValue = node.step ? (this.evalExpr(node.step) as number) : (start <= end ? 1 : -1);
          let iterations = 0;
          for (let i = start; stepValue > 0 ? i <= end : i >= end; i += stepValue) {
            if (iterations >= this.maxLoopIterations) {
              throw new RuntimeError(node.line, `Limite de ${this.maxLoopIterations} iterações excedido no 'para'`, 'Verifique se o loop tem uma condição de parada.', 'para i de 0 ate 10 faca\n  ...\nfimPara');
            }
            this.variables.set(node.varName, i);
            try {
              this.execBlock(node.body);
            } catch (e) {
              if (e instanceof BreakSignal) break;
              if (e instanceof ContinueSignal) { iterations++; continue; }
              throw e;
            }
            iterations++;
          }
        }
        break;
      }
      case "function_decl": {
        // Register user-defined function
        this.functions.set(node.name, { decl: node });
        break;
      }
      case "return": {
        const value = node.expr ? this.evalExpr(node.expr) : null;
        throw new ReturnSignal(value);
      }
      case "break": {
        throw new BreakSignal();
      }
      case "continue": {
        throw new ContinueSignal();
      }
    }
  }

  private execCall(callee: string, args: ExprNode[], line: number): void {
    // Check for user-defined functions first
    const userFunc = this.functions.get(callee);
    if (userFunc) {
      this.execUserFunction(userFunc, args, line);
      return;
    }

    switch (callee) {
      case "escreva":
      case "escrevaln": {
        const parts = args.map((arg) => this.formatValue(this.evalExpr(arg)));
        const text = parts.join("");
        if (callee === "escrevaln") {
          this.flushBuffer();
          this.console.push({ id: this.nextId++, text, type: "output", timestamp: getTimestamp() });
        } else {
          this.outputBuffer += text;
        }
        break;
      }
      case "leia": {
        const varNames = args.map((a) => (a.kind === "identifier" ? a.name : ""));
        throw new InputRequestError("> ", varNames);
      }
      default: {
        const result = this.callBuiltin(callee, args.map((a) => this.evalExpr(a)), line);
        if (result !== undefined) {
          this.console.push({ id: this.nextId++, text: this.formatValue(result), type: "output", timestamp: getTimestamp() });
        }
        break;
      }
    }
  }

  private execUserFunction(func: UserFunction, args: ExprNode[], line: number): void {
    if (this.callStack.length > 50) {
      throw new RuntimeError(line, 'Pilha de chamadas muito profunda (recursão infinita?)', 'Verifique se as chamadas recursivas têm condição de parada.', 'funcao inteiro fatorial(n)\n  se (n <= 1) entao\n    retorne 1\n  senao\n    retorne n * fatorial(n - 1)\nfim');
    }

    const { decl } = func;

    // Save current values of params (they may shadow globals)
    const savedParamValues = new Map<string, unknown>();
    for (const param of decl.params) {
      if (this.variables.has(param.name)) {
        savedParamValues.set(param.name, this.variables.get(param.name));
      }
    }

    // Bind arguments to parameters
    for (let i = 0; i < decl.params.length; i++) {
      const param = decl.params[i];
      const argValue = i < args.length ? this.evalExpr(args[i]) : this.defaultValueForType(param.typeName);
      this.variables.set(param.name, argValue);
    }

    this.callStack.push(decl.name);
    const varKeysSnapshot = new Set(this.variables.keys());
    try {
      this.execBlock(decl.body);
    } catch (e) {
      if (e instanceof ReturnSignal) {
        // Function returned a value - do nothing here, it's handled in evalExpr for call_expr
      } else if (e instanceof BreakSignal || e instanceof ContinueSignal) {
        throw new RuntimeError(line, `'${e instanceof BreakSignal ? 'pare' : 'continua'}' usado fora de um loop`, 'O comando de controle de fluxo deve ser usado dentro de um loop (enquanto ou para).');
      } else {
        throw e;
      }
    } finally {
      this.callStack.pop();
      // Remove local variables created inside the function
      for (const key of this.variables.keys()) {
        if (!varKeysSnapshot.has(key)) {
          this.variables.delete(key);
        }
      }
      // Restore only param bindings to their previous values, preserving global mutations
      for (const [name, oldValue] of savedParamValues) {
        this.variables.set(name, oldValue);
      }
      // Remove params that didn't exist before
      for (const param of decl.params) {
        if (!savedParamValues.has(param.name)) {
          this.variables.delete(param.name);
        }
      }
    }
  }

  private defaultValueForType(typeName: string | null): number | string | boolean | unknown[] {
    return defaultValueForType(typeName ?? "");
  }

  private createArray(dims: number[]): unknown {
    const size = dims[0];
    if (dims.length === 1) {
      return Array.from({ length: size }, () => defaultValueForType("inteiro"));
    }
    return Array.from({ length: size }, () => this.createArray(dims.slice(1)));
  }

  private flushBuffer(): void {
    if (this.outputBuffer) {
      this.console.push({ id: this.nextId++, text: this.outputBuffer, type: "output", timestamp: getTimestamp() });
      this.outputBuffer = "";
    }
  }

  private callBuiltin(name: string, args: unknown[], line: number): unknown {
    switch (name) {
      case "raiz": return Math.sqrt(args[0] as number);
      case "potencia": return Math.pow(args[0] as number, args[1] as number);
      case "modulo": return (args[0] as number) % (args[1] as number);
      case "abs": return Math.abs(args[0] as number);
      case "arredondar": return Math.round(args[0] as number);
      case "tamanho": {
        const val = args[0];
        if (typeof val === "string") return val.length;
        if (Array.isArray(val)) return val.length;
        throw new RuntimeError(line, "'tamanho' espera texto ou vetor", 'Use com uma string ou vetor.', 'tamanho("olá") ou tamanho(vetor)');
      }
      case "subtexto": {
        const str = String(args[0]);
        const start = args[1] as number;
        const end = args[2] as number;
        if (typeof start !== "number" || !Number.isInteger(start)) {
          throw new RuntimeError(line, "subtexto: segundo argumento deve ser um inteiro", "Use um número inteiro para a posição inicial.", 'subtexto("olá", 0, 3)');
        }
        if (typeof end !== "number" || !Number.isInteger(end)) {
          throw new RuntimeError(line, "subtexto: terceiro argumento deve ser um inteiro", "Use um número inteiro para a posição final.", 'subtexto("olá", 0, 3)');
        }
        return str.substring(start, end);
      }
      case "maiusculo": return String(args[0]).toUpperCase();
      case "minusculo": return String(args[0]).toLowerCase();
      case "posicao": return String(args[0]).indexOf(String(args[1]));
      case "tipo": {
        const val = args[0];
        if (typeof val === "number") return "inteiro";
        if (typeof val === "string") return "texto";
        if (typeof val === "boolean") return "logico";
        if (Array.isArray(val)) return "vetor";
        return "nulo";
      }
      case "tamanho_vetor": {
        if (!Array.isArray(args[0])) throw new RuntimeError(line, 'Esperado um vetor', 'Use com um vetor.', 'inteiro vetor[3] = [1, 2, 3]\ntamanho_vetor(vetor)');
        return args[0].length;
      }
      default:
        throw new RuntimeError(line, `Função '${name}' não encontrada`, 'Verifique se a função foi declarada.', 'funcao minhaFuncao()\n  ...\nfim');
    }
  }

  private formatValue(value: unknown): string {
    if (typeof value === "boolean") return value ? "verdadeiro" : "falso";
    if (value === null || value === undefined) return "nulo";
    if (Array.isArray(value)) return "[" + value.join(", ") + "]";
    return String(value);
  }

  execBlock(nodes: ASTNode[]): void {
    for (const node of nodes) {
      this.execNode(node);
    }
  }

  execBlockFrom(nodes: ASTNode[], startIndex: number): void {
    for (let i = startIndex; i < nodes.length; i++) {
      this.execNode(nodes[i]);
    }
  }

  evalExpr(node: ExprNode): unknown {
    switch (node.kind) {
      case "literal":
        return node.value;
      case "identifier": {
        if (!this.variables.has(node.name)) {
          throw new RuntimeError(node.line, `Variável '${node.name}' não definida`, 'Declare a variável antes de usar.', `inteiro ${node.name} = 0`);
        }
        return this.variables.get(node.name);
      }
      case "binop": {
        const left = this.evalExpr(node.left);
        const right = this.evalExpr(node.right);
        return this.applyBinOp(node.op, left, right, node.line);
      }
      case "unaryop": {
        const operand = this.evalExpr(node.operand);
        if (node.op === "-") return -(operand as number);
        if (node.op === "!") return !operand;
        throw new RuntimeError(node.line, `Operador unário desconhecido: ${node.op}`, 'Use "-" para negação ou "!" para negação lógica.', '-valor ou !verdadeiro');
      }
      case "array":
        return node.elements.map((el) => this.evalExpr(el));
      case "array_access": {
        let current: unknown = this.variables.get(node.name);
        for (let d = 0; d < node.indices.length; d++) {
          const idx = this.evalExpr(node.indices[d]);
          if (typeof idx !== "number" || !Number.isInteger(idx)) {
            throw new RuntimeError(node.line, 'Índice inválido', 'Use um número inteiro como índice.', 'vetor[0]');
          }
          if (typeof current === "string") {
            if (idx < 0 || idx >= current.length) {
              throw new RuntimeError(node.line, `Índice ${idx} fora dos limites de '${node.name}' (tamanho: ${current.length})`, `Use um índice entre 0 e ${current.length - 1}.`, `${node.name}[0]`);
            }
            if (d < node.indices.length - 1) {
              throw new RuntimeError(node.line, 'Não é possível acessar caracteres de uma string com múltiplos índices');
            }
            return current[idx];
          }
          if (!Array.isArray(current)) {
            throw new RuntimeError(node.line, `'${node.name}' não é um array ou texto`, 'Use com um vetor ou texto.', 'mostrar(vetor[0]) ou mostrar(texto[0])');
          }
          if (idx < 0 || idx >= current.length) {
            throw new RuntimeError(node.line, `Índice ${idx} fora dos limites de '${node.name}' (tamanho: ${current.length})`, `Use um índice entre 0 e ${current.length - 1}.`, `${node.name}[0]`);
          }
          current = current[idx];
        }
        return current;
      }
      case "call_expr": {
        // Check for user-defined functions
        const userFunc = this.functions.get(node.callee);
        if (userFunc) {
          return this.evalUserFunction(userFunc, node.args, node.line);
        }
        const args = node.args.map((a) => this.evalExpr(a));
        return this.callBuiltin(node.callee, args, node.line);
      }
      case "conditional_expr": {
        const condition = this.evalExpr(node.condition);
        if (condition) {
          return this.evalExpr(node.thenBranch);
        } else if (node.elseBranch) {
          return this.evalExpr(node.elseBranch);
        }
        return null;
      }
    }
  }

  private evalUserFunction(func: UserFunction, args: ExprNode[], line: number): unknown {
    if (this.callStack.length > 50) {
      throw new RuntimeError(line, 'Pilha de chamadas muito profunda (recursão infinita?)');
    }

    const { decl } = func;

    // Save current values of params (they may shadow globals)
    const savedParamValues = new Map<string, unknown>();
    for (const param of decl.params) {
      if (this.variables.has(param.name)) {
        savedParamValues.set(param.name, this.variables.get(param.name));
      }
    }

    // Bind arguments to parameters
    for (let i = 0; i < decl.params.length; i++) {
      const param = decl.params[i];
      const argValue = i < args.length ? this.evalExpr(args[i]) : this.defaultValueForType(param.typeName);
      this.variables.set(param.name, argValue);
    }

    this.callStack.push(decl.name);
    const varKeysSnapshot = new Set(this.variables.keys());
    let returnValue: unknown = null;
    try {
      this.execBlock(decl.body);
    } catch (e) {
      if (e instanceof ReturnSignal) {
        returnValue = e.value;
      } else if (e instanceof BreakSignal || e instanceof ContinueSignal) {
        throw new RuntimeError(line, `'${e instanceof BreakSignal ? 'pare' : 'continua'}' usado fora de um loop`, 'O comando de controle de fluxo deve ser usado dentro de um loop (enquanto ou para).');
      } else {
        throw e;
      }
    } finally {
      this.callStack.pop();
      // Remove local variables created inside the function
      for (const key of this.variables.keys()) {
        if (!varKeysSnapshot.has(key)) {
          this.variables.delete(key);
        }
      }
      // Restore only param bindings to their previous values, preserving global mutations
      for (const [name, oldValue] of savedParamValues) {
        this.variables.set(name, oldValue);
      }
      // Remove params that didn't exist before
      for (const param of decl.params) {
        if (!savedParamValues.has(param.name)) {
          this.variables.delete(param.name);
        }
      }
    }
    return returnValue;
  }

  private applyBinOp(op: string, left: unknown, right: unknown, line: number): unknown {
    switch (op) {
      case "+":
        if (typeof left === "string" || typeof right === "string") {
          return String(left ?? "") + String(right ?? "");
        }
        return (left as number) + (right as number);
      case "-": return (left as number) - (right as number);
      case "*": return (left as number) * (right as number);
      case "/": {
        if ((right as number) === 0) throw new RuntimeError(line, 'Divisão por zero', 'Verifique se o divisor é diferente de zero.', 'se (divisor != 0) entao\n  resultado = numerador / divisor\nfimSe');
        return (left as number) / (right as number);
      }
      case "div": {
        if ((right as number) === 0) throw new RuntimeError(line, 'Divisão por zero', 'Verifique se o divisor é diferente de zero.', 'se (divisor != 0) entao\n  resultado = numerador div divisor\nfimSe');
        return Math.floor((left as number) / (right as number));
      }
      case "%": {
        if ((right as number) === 0) throw new RuntimeError(line, 'Divisão por zero', 'Verifique se o divisor é diferente de zero.', 'se (divisor != 0) entao\n  resultado = resto % divisor\nfimSe');
        return (left as number) % (right as number);
      }
      case "==": return left == right;
      case "!=": return left != right;
      case "<": return (left as number) < (right as number);
      case ">": return (left as number) > (right as number);
      case "<=": return (left as number) <= (right as number);
      case ">=": return (left as number) >= (right as number);
      case "&&": return Boolean(left) && Boolean(right);
      case "||": return Boolean(left) || Boolean(right);
      // Legacy word-style operators (normalized in parser, but keep for safety)
      case "e": return Boolean(left) && Boolean(right);
      case "ou": return Boolean(left) || Boolean(right);
      default: throw new RuntimeError(line, `Operador binário desconhecido: ${op}`, 'Use operadores válidos: +, -, *, /, %, ==, !=, <, >, <=, >=, &&, ||');
    }
  }

  run(ast: ASTNode[]): void {
    this.iterationCount = 0;
    this.outputBuffer = "";
    this.currentExecIndex = 0;
    this.execBlock(ast);
    this.flushBuffer();
  }

  step(ast: ASTNode[]): ASTNode | null {
    if (this.currentExecIndex >= ast.length) return null;

    const node = ast[this.currentExecIndex];
    this.execNode(node);
    this.currentExecIndex++;
    return this.currentExecIndex < ast.length ? ast[this.currentExecIndex] : null;
  }

  getState(): {
    variables: Record<string, unknown>;
    currentLine: number;
    currentExecIndex: number;
    console: ConsoleLine[];
  } {
    const vars: Record<string, unknown> = {};
    this.variables.forEach((value, key) => {
      vars[key] = value;
    });
    return {
      variables: vars,
      currentLine: this.currentLine,
      currentExecIndex: this.currentExecIndex,
      console: [...this.console],
    };
  }

  reset(): void {
    this.variables.clear();
    this.constants.clear();
    this.functions.clear();
    this.console = [];
    this.currentLine = 0;
    this.currentExecIndex = 0;
    this.iterationCount = 0;
    this.outputBuffer = "";
    this.callStack = [];
    this.nextId = 0;
  }
}
