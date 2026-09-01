export interface ErrorContext {
  callStack?: string[];
  sourceLine?: string;
  elapsed?: number;
}

export class ParseError extends Error {
  line: number;
  hint?: string;
  example?: string;

  constructor(line: number, message: string, hint?: string, example?: string) {
    super(`Linha ${line}: ${message}`);
    this.name = "ParseError";
    this.line = line;
    this.hint = hint;
    this.example = example;
  }

  format(): string {
    let msg = this.message;
    if (this.hint) msg += `|||${this.hint}`;
    if (this.example) msg += `|||${this.example}`;
    return msg;
  }
}

export class RuntimeError extends Error {
  line: number;
  hint?: string;
  example?: string;
  callStack?: string[];
  sourceLine?: string;
  elapsed?: number;

  constructor(line: number, message: string, hint?: string, example?: string, context?: ErrorContext) {
    super(`Linha ${line}: ${message}`);
    this.name = "RuntimeError";
    this.line = line;
    this.hint = hint;
    this.example = example;
    this.callStack = context?.callStack;
    this.sourceLine = context?.sourceLine;
    this.elapsed = context?.elapsed;
  }

  format(): string {
    let msg = this.message;
    if (this.sourceLine) msg += `|||${this.sourceLine}`;
    if (this.hint) msg += `|||${this.hint}`;
    if (this.example) msg += `|||${this.example}`;
    if (this.callStack && this.callStack.length > 0) {
      const stack = this.callStack.join(" → ");
      msg += `\n  Em: ${stack}`;
    }
    if (this.elapsed !== undefined && this.elapsed > 0) {
      msg += `\n  Tempo: ${this.elapsed}ms`;
    }
    return msg;
  }
}
