import { describe, it, expect } from "vitest";
import { tokenize } from "../src/tokenizer.js";
import { parse } from "../src/parser.js";
import { Interpreter, InputRequestError } from "../src/interpreter.js";

function runCode(code: string): Interpreter {
  const tokens = tokenize(code);
  const ast = parse(tokens);
  const interpreter = new Interpreter();
  interpreter.run(ast);
  return interpreter;
}

function runCodeLines(code: string): string[] {
  const interp = runCode(code);
  return interp.console.filter((l) => l.type === "output").map((l) => l.text);
}

describe("Interpreter", () => {
  describe("variable declarations", () => {
    it("declares and initializes variables", () => {
      const lines = runCodeLines('programa { mostrar(5) }');
      expect(lines[0]).toBe("5");
    });

    it("handles default values", () => {
      const interp = runCode('programa { inteiro x }');
      expect(interp.variables.get("x")).toBe(0);
    });

    it("handles texto default", () => {
      const interp = runCode('programa { texto nome }');
      expect(interp.variables.get("nome")).toBe("");
    });

    it("handles logico default", () => {
      const interp = runCode('programa { logico flag }');
      expect(interp.variables.get("flag")).toBe(false);
    });
  });

  describe("constants", () => {
    it("allows reading constants", () => {
      const lines = runCodeLines('programa { constante PI = 3.14\nmostrar(PI) }');
      expect(lines[0]).toBe("3.14");
    });

    it("rejects constant reassignment", () => {
      expect(() => runCode('programa { constante PI = 3.14\nPI = 3.0 }')).toThrow("constante");
    });
  });

  describe("assignments", () => {
    it("assigns values", () => {
      const interp = runCode('programa { inteiro x\nx = 10 }');
      expect(interp.variables.get("x")).toBe(10);
    });

    it("rejects undeclared variable", () => {
      expect(() => runCode('programa { y = 10 }')).toThrow("não declarada");
    });
  });

  describe("arrays", () => {
    it("declares and accesses arrays", () => {
      const lines = runCodeLines('programa { inteiro vetor[3]\nvetor[0] = 42\nmostrar(vetor[0]) }');
      expect(lines[0]).toBe("42");
    });

    it("assigns with dynamic index", () => {
      const lines = runCodeLines('programa { inteiro v[5]\npara (inteiro i = 0; i < 5; i = i + 1) { v[i] = i * 10 }\nmostrar(v[2]) }');
      expect(lines[0]).toBe("20");
    });
  });

  describe("I/O", () => {
    it("prints values", () => {
      const lines = runCodeLines('programa { mostrar("hello") }');
      expect(lines[0]).toBe("hello");
    });

    it("prints multiple values", () => {
      const lines = runCodeLines('programa { mostrar(1, 2, 3) }');
      expect(lines[0]).toBe("123");
    });

    it("handles input request", () => {
      const tokens = tokenize('programa { capturar(x) }');
      const ast = parse(tokens);
      const interp = new Interpreter();
      interp.variables.set("x", 0);
      expect(() => interp.run(ast)).toThrow(InputRequestError);
    });
  });

  describe("control flow", () => {
    it("executes se/entao", () => {
      const lines = runCodeLines('programa { inteiro x = 5\nse (x > 0) { mostrar("pos") } }');
      expect(lines[0]).toBe("pos");
    });

    it("executes se/senao", () => {
      const lines = runCodeLines('programa { inteiro x = -1\nse (x > 0) { mostrar("pos") } senao { mostrar("neg") } }');
      expect(lines[0]).toBe("neg");
    });

    it("executes enquanto", () => {
      const lines = runCodeLines('programa { inteiro x = 0\nenquanto (x < 3) { x = x + 1 }\nmostrar(x) }');
      expect(lines[0]).toBe("3");
    });

    it("executes para legacy", () => {
      const lines = runCodeLines('programa { inteiro soma = 0\npara i de 1 ate 3 { soma = soma + i }\nmostrar(soma) }');
      expect(lines[0]).toBe("6");
    });
  });

  describe("functions", () => {
    it("declares and calls functions", () => {
      const lines = runCodeLines('programa { funcao inteiro dobro(inteiro x) { retorne x * 2 }\nmostrar(dobro(5)) }');
      expect(lines[0]).toBe("10");
    });

    it("supports multiple parameters", () => {
      const lines = runCodeLines('programa { funcao inteiro soma(inteiro a, inteiro b) { retorne a + b }\nmostrar(soma(3, 4)) }');
      expect(lines[0]).toBe("7");
    });
  });

  describe("iteration limit", () => {
    it("throws on infinite loop", () => {
      expect(() => runCode('programa { enquanto (verdadeiro) { } }')).toThrow("iterações");
    });
  });

  describe("reset", () => {
    it("clears all state", () => {
      const interp = runCode('programa { inteiro x\nx = 5\nmostrar(x) }');
      expect(interp.variables.size).toBeGreaterThan(0);
      interp.reset();
      expect(interp.variables.size).toBe(0);
      expect(interp.console).toHaveLength(0);
    });
  });
});
