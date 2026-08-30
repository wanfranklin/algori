import { describe, it, expect } from "vitest";
import { tokenize } from "../src/tokenizer.js";
import { parse } from "../src/parser.js";
import { ParseError } from "../src/errors.js";

function parseCode(code: string) {
  return parse(tokenize(code));
}

describe("parse", () => {
  describe("variable declarations", () => {
    it("parses typed variable declaration", () => {
      const ast = parseCode('programa { inteiro x = 5 }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
      const decl = ast.find((n) => n.kind === "var_decl");
      expect(decl).toBeDefined();
    });

    it("parses untyped variable declaration", () => {
      const ast = parseCode('programa { x = 5 }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });

    it("parses array declaration", () => {
      const ast = parseCode('programa { inteiro vetor[10] }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
      const decl = ast.find((n) => n.kind === "var_decl");
      expect(decl).toBeDefined();
    });

    it("parses 2D matrix declaration", () => {
      const ast = parseCode('programa { real matriz[3][4] }');
      const decl = ast.find((n) => n.kind === "var_decl");
      expect(decl).toBeDefined();
      if (decl?.kind === "var_decl") {
        expect(decl.dimensions).toHaveLength(2);
      }
    });

    it("parses constante", () => {
      const ast = parseCode('programa { constante PI = 3.14 }');
      const decl = ast.find((n) => n.kind === "var_decl");
      expect(decl).toBeDefined();
      if (decl?.kind === "var_decl") {
        expect(decl.isConstant).toBe(true);
      }
    });
  });

  describe("assignments", () => {
    it("parses simple assignment", () => {
      const ast = parseCode('programa { x = 10 }');
      const assign = ast.find((n) => n.kind === "assign");
      expect(assign).toBeDefined();
    });

    it("parses array assign", () => {
      const ast = parseCode('programa { vetor[0] = 5 }');
      const assign = ast.find((n) => n.kind === "array_assign");
      expect(assign).toBeDefined();
    });
  });

  describe("I/O", () => {
    it("parses escreva", () => {
      const ast = parseCode('programa { escreva("hello") }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });

    it("parses leia", () => {
      const ast = parseCode('programa { leia(x) }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });

    it("parses mostrar", () => {
      const ast = parseCode('programa { mostrar("hello") }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("control flow", () => {
    it("parses se/entao/senao with braces", () => {
      const ast = parseCode('programa { se (x > 0) { mostrar("pos") } senao { mostrar("neg") } }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
      const ifNode = ast.find((n) => n.kind === "if");
      expect(ifNode).toBeDefined();
    });

    it("parses enquanto with braces", () => {
      const ast = parseCode('programa { enquanto (x < 10) { x = x + 1 } }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
      const whileNode = ast.find((n) => n.kind === "while");
      expect(whileNode).toBeDefined();
    });

    it("parses para legacy", () => {
      const ast = parseCode('programa { para i de 0 ate 10 { mostrar(i) } }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
      const forNode = ast.find((n) => n.kind === "for");
      expect(forNode).toBeDefined();
    });

    it("parses para C-style", () => {
      const ast = parseCode('programa { para (inteiro i = 0; i < 10; i = i + 1) { mostrar(i) } }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
      const forNode = ast.find((n) => n.kind === "for");
      expect(forNode).toBeDefined();
    });

    it("parses pare (break)", () => {
      const ast = parseCode('programa { enquanto (verdadeiro) { pare } }');
      const whileNode = ast.find((n) => n.kind === "while") as any;
      expect(whileNode).toBeDefined();
      const breakNode = whileNode.body.find((n: any) => n.kind === "break");
      expect(breakNode).toBeDefined();
    });

    it("parses continua (continue)", () => {
      const ast = parseCode('programa { enquanto (verdadeiro) { continua } }');
      const whileNode = ast.find((n) => n.kind === "while") as any;
      expect(whileNode).toBeDefined();
      const continueNode = whileNode.body.find((n: any) => n.kind === "continue");
      expect(continueNode).toBeDefined();
    });
  });

  describe("functions", () => {
    it("parses function declaration", () => {
      const ast = parseCode('programa { funcao inteiro somar(inteiro a, inteiro b) { retorne a + b } }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
      const fn = ast.find((n) => n.kind === "function_decl");
      expect(fn).toBeDefined();
    });

    it("parses function call", () => {
      const ast = parseCode('programa { somar(1, 2) }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("program headers", () => {
    it("parses algori header", () => {
      const ast = parseCode('algori\n  mostrar("hello")');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });

    it("parses programa header", () => {
      const ast = parseCode('programa\n  mostrar("hello")');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("expressions", () => {
    it("parses binary operations", () => {
      const ast = parseCode('programa { mostrar(2 + 3) }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });

    it("parses comparison operators", () => {
      const ast = parseCode('programa { mostrar(2 > 1) }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });

    it("parses logical operators", () => {
      const ast = parseCode('programa { mostrar(1 e 2) }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });

    it("parses negation", () => {
      const ast = parseCode('programa { mostrar(nao verdadeiro) }');
      expect(ast.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("error cases", () => {
    it("throws ParseError on invalid type", () => {
      expect(() => parseCode('programa { invalido x = 5 }')).toThrow(ParseError);
    });

    it("throws ParseError on missing variable name", () => {
      expect(() => parseCode('programa { funcao vazio ( ) { } }')).toThrow(ParseError);
    });

    it("throws ParseError on missing = in assignment", () => {
      expect(() => parseCode('programa { x + 5 }')).toThrow();
    });

    it("throws ParseError on unclosed parenthesis in function call", () => {
      expect(() => parseCode('programa { mostrar(1 }')).toThrow(ParseError);
    });

    it("throws ParseError on missing function name", () => {
      expect(() => parseCode('programa { funcao inteiro ( ) { } }')).toThrow(ParseError);
    });
  });
});
