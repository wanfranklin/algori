import type {
  ASTNode,
  ExprNode,
  ConsoleLine,
  FunctionDeclNode,
} from "../types/index.js";
import { defaultValueForType } from "./utils.js";

export class InputRequestError extends Error {
  prompt: string;
  args: string[];

  constructor(prompt: string, args: string[]) {
    super("Input request");
    this.name = "InputRequestError";
    this.prompt = prompt;
    this.args = args;
  }
}

export class ReturnSignal extends Error {
  value: unknown;
  constructor(value: unknown) {
    super("return");
    this.name = "ReturnSignal";
    this.value = value;
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
  maxIterations: number = 10000;
  iterationCount: number = 0;
  outputBuffer: string = "";
  callStack: string[] = [];
  private nextId: number = 0;

  execNode(node: ASTNode): void {
    this.currentLine = node.line;
    this.iterationCount++;

    if (this.iterationCount > this.maxIterations) {
      throw new Error(
        `Linha ${node.line}: Limite de ${this.maxIterations} iterações excedido. Verifique se não há loops infinitos.`
      );
    }

    switch (node.kind) {
      case "var_decl": {
        const value = this.evalExpr(node.expr);
        this.variables.set(node.name, value);
        if (node.isConstant) {
          this.constants.add(node.name);
        }
        break;
      }
      case "assign": {
        const target = node.name;
        if (this.constants.has(target)) {
          throw new Error(`Linha ${node.line}: Não é possível alterar a constante '${target}'|||Constantes não podem ser reatribuídas.|||constante PI = 3.14\nmostrar(PI)`);
        }
        if (!this.variables.has(target)) {
          throw new Error(`Linha ${node.line}: Variável '${target}' não declarada|||Declare a variável antes de usar.|||inteiro ${target} = 0`);
        }
        const value = this.evalExpr(node.expr);
        this.variables.set(target, value);
        break;
      }
      case "array_assign": {
        const arr = this.variables.get(node.name);
        if (!Array.isArray(arr)) {
          throw new Error(`Linha ${node.line}: '${node.name}' não é um array|||Use um vetor para acessar por índice.|||inteiro vetor[] = {1, 2, 3}\nmostrar(vetor[0])`);
        }
        const idx = this.evalExpr(node.index);
        if (typeof idx !== "number" || !Number.isInteger(idx)) {
          throw new Error(`Linha ${node.line}: Índice inválido|||Use um número inteiro como índice.|||vetor[0]`);
        }
        (arr as unknown[])[idx] = this.evalExpr(node.expr);
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
          if (iterations >= this.maxIterations) {
            throw new Error(`Linha ${node.line}: Limite de ${this.maxIterations} iterações excedido no 'enquanto'|||Verifique se há uma condição de saída no loop.|||enquanto (x < 10) faca\n  x = x + 1\nfimEnquanto`);
          }
          this.execBlock(node.body);
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
            if (iterations >= this.maxIterations) {
              throw new Error(`Linha ${node.line}: Limite de ${this.maxIterations} iterações excedido no 'para'|||Verifique se o loop tem uma condição de parada.|||para (inteiro i = 0; i < 10; i = i + 1) faca\n  ...\nfimPara`);
            }
            this.execBlock(node.body);
            iterations++;
          }
        } else {
          // Legacy for: end is a numeric bound
          const end = this.evalExpr(node.end) as number;
          const stepValue = node.step ? (this.evalExpr(node.step) as number) : (start <= end ? 1 : -1);
          for (let i = start; stepValue > 0 ? i <= end : i >= end; i += stepValue) {
            this.variables.set(node.varName, i);
            this.execBlock(node.body);
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
      throw new Error(`Linha ${line}: Pilha de chamadas muito profunda (recursão infinita?)|||Verifique se as chamadas recursivas têm condição de parada.|||funcao inteiro fatorial(n)\n  se (n <= 1) entao\n    retorne 1\n  senao\n    retorne n * fatorial(n - 1)\nfim`);
    }

    const { decl } = func;
    const savedVars = new Map(this.variables);

    // Bind arguments to parameters
    for (let i = 0; i < decl.params.length; i++) {
      const param = decl.params[i];
      const argValue = i < args.length ? this.evalExpr(args[i]) : this.defaultValueForType(param.typeName);
      this.variables.set(param.name, argValue);
    }

    this.callStack.push(decl.name);
    try {
      this.execBlock(decl.body);
    } catch (e) {
      if (e instanceof ReturnSignal) {
        // Function returned a value - do nothing here, it's handled in evalExpr for call_expr
        // For direct calls (not in expression), we can optionally push to console
      } else {
        throw e;
      }
    } finally {
      this.callStack.pop();
      // Restore variables (except the function's params)
      this.variables = savedVars;
    }
  }

  private defaultValueForType(typeName: string | null): number | string | boolean {
    return defaultValueForType(typeName ?? "");
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
      case "modulo": return Math.abs(args[0] as number);
      case "abs": return Math.abs(args[0] as number);
      case "arredondar": return Math.round(args[0] as number);
      case "tamanho": {
        const val = args[0];
        if (typeof val === "string") return val.length;
        if (Array.isArray(val)) return val.length;
        throw new Error(`Linha ${line}: 'tamanho' espera texto ou vetor|||Use com uma string ou vetor.|||tamanho("olá") ou tamanho(vetor)`);
      }
      case "subtexto": return String(args[0]).substring(args[1] as number, args[2] as number);
      case "maiusculo": return String(args[0]).toUpperCase();
      case "minusculo": return String(args[0]).toLowerCase();
      case "posicao": return String(args[0]).indexOf(String(args[1]));
      case "tipo": {
        const val = args[0];
        if (typeof val === "number") return "inteiro";
        if (typeof val === "string") return "caractere";
        if (typeof val === "boolean") return "logico";
        if (Array.isArray(val)) return "vetor";
        return "nulo";
      }
      case "tamanho_vetor": {
        if (!Array.isArray(args[0])) throw new Error(`Linha ${line}: Esperado um vetor|||Use com um vetor.|||inteiro vetor[] = {1, 2, 3}\ntamanho_vetor(vetor)`);
        return args[0].length;
      }
      default:
        throw new Error(`Linha ${line}: Função '${name}' não encontrada|||Verifique se a função foi declarada.|||funcao minhaFuncao()\n  ...\nfim`);
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

  evalExpr(node: ExprNode): unknown {
    switch (node.kind) {
      case "literal":
        return node.value;
      case "identifier": {
        if (!this.variables.has(node.name)) {
          throw new Error(`Linha ${node.line}: Variável '${node.name}' não definida|||Declare a variável antes de usar.|||inteiro ${node.name} = 0`);
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
        throw new Error(`Linha ${node.line}: Operador unário desconhecido: ${node.op}|||Use "-" para negação ou "!" para negação lógica.|||-valor ou !verdadeiro`);
      }
      case "array":
        return node.elements.map((el) => this.evalExpr(el));
      case "array_access": {
        const arr = this.variables.get(node.name);
        const index = this.evalExpr(node.index) as number;
        if (typeof arr === "string") {
          if (index < 0 || index >= arr.length) {
            throw new Error(
              `Linha ${node.line}: Índice ${index} fora dos limites de '${node.name}' (tamanho: ${arr.length})|||Use um índice entre 0 e ${arr.length - 1}.|||${node.name}[0]`
            );
          }
          return arr[index];
        }
        if (!Array.isArray(arr)) {
          throw new Error(`Linha ${node.line}: '${node.name}' não é um array ou texto|||Use com um vetor ou texto.|||mostrar(vetor[0]) ou mostrar(texto[0])`);
        }
        if (index < 0 || index >= arr.length) {
          throw new Error(
            `Linha ${node.line}: Índice ${index} fora dos limites de '${node.name}' (tamanho: ${arr.length})|||Use um índice entre 0 e ${arr.length - 1}.|||${node.name}[0]`
          );
        }
        return arr[index];
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
        } else {
          return this.evalExpr(node.elseBranch);
        }
      }
    }
  }

  private evalUserFunction(func: UserFunction, args: ExprNode[], line: number): unknown {
    if (this.callStack.length > 50) {
      throw new Error(`Linha ${line}: Pilha de chamadas muito profunda (recursão infinita?)`);
    }

    const { decl } = func;
    const savedVars = new Map(this.variables);

    // Bind arguments to parameters
    for (let i = 0; i < decl.params.length; i++) {
      const param = decl.params[i];
      const argValue = i < args.length ? this.evalExpr(args[i]) : this.defaultValueForType(param.typeName);
      this.variables.set(param.name, argValue);
    }

    this.callStack.push(decl.name);
    let returnValue: unknown = null;
    try {
      this.execBlock(decl.body);
    } catch (e) {
      if (e instanceof ReturnSignal) {
        returnValue = e.value;
      } else {
        throw e;
      }
    } finally {
      this.callStack.pop();
      this.variables = savedVars;
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
        if ((right as number) === 0) throw new Error(`Linha ${line}: Divisão por zero|||Verifique se o divisor é diferente de zero.|||se (divisor != 0) entao\n  resultado = numerador / divisor\nfimSe`);
        return (left as number) / (right as number);
      }
      case "div": {
        if ((right as number) === 0) throw new Error(`Linha ${line}: Divisão por zero|||Verifique se o divisor é diferente de zero.|||se (divisor != 0) entao\n  resultado = numerador div divisor\nfimSe`);
        return Math.floor((left as number) / (right as number));
      }
      case "%": return (left as number) % (right as number);
      case "==": return left === right;
      case "!=": return left !== right;
      case "<": return (left as number) < (right as number);
      case ">": return (left as number) > (right as number);
      case "<=": return (left as number) <= (right as number);
      case ">=": return (left as number) >= (right as number);
      case "&&": return Boolean(left) && Boolean(right);
      case "||": return Boolean(left) || Boolean(right);
      // Legacy word-style operators (normalized in parser, but keep for safety)
      case "e": return Boolean(left) && Boolean(right);
      case "ou": return Boolean(left) || Boolean(right);
      default: throw new Error(`Linha ${line}: Operador binário desconhecido: ${op}|||Use operadores válidos: +, -, *, /, %, ==, !=, <, >, <=, >=, &&, ||`);
    }
  }

  run(ast: ASTNode[]): void {
    this.iterationCount = 0;
    this.outputBuffer = "";
    this.execBlock(ast);
    this.flushBuffer();
  }

  step(ast: ASTNode[]): ASTNode | null {
    const currentIndex = ast.findIndex(
      (n) => n.line === this.currentLine
    );
    const nextIndex = currentIndex === -1 ? 0 : currentIndex + 1;

    if (nextIndex >= ast.length) return null;

    const node = ast[nextIndex];
    this.execNode(node);
    return ast[nextIndex + 1] ?? null;
  }

  getState(): {
    variables: Record<string, unknown>;
    currentLine: number;
    console: ConsoleLine[];
  } {
    const vars: Record<string, unknown> = {};
    this.variables.forEach((value, key) => {
      vars[key] = value;
    });
    return {
      variables: vars,
      currentLine: this.currentLine,
      console: [...this.console],
    };
  }

  reset(): void {
    this.variables.clear();
    this.constants.clear();
    this.functions.clear();
    this.console = [];
    this.currentLine = 0;
    this.iterationCount = 0;
    this.outputBuffer = "";
    this.callStack = [];
    this.nextId = 0;
  }
}
