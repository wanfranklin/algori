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

  constructor(line: number, message: string, hint?: string, example?: string) {
    super(`Linha ${line}: ${message}`);
    this.name = "RuntimeError";
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
