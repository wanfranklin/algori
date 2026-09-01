import { describe, it, expect } from "vitest";
import { tokenize } from "../src/tokenizer.js";

describe("tokenize", () => {
  it("tokenizes numbers", () => {
    const tokens = tokenize("42 3.14");
    const nums = tokens.filter((t) => t.type === "NUMBER");
    expect(nums).toHaveLength(2);
    expect(nums[0].value).toBe("42");
    expect(nums[1].value).toBe("3.14");
  });

  it("tokenizes strings", () => {
    const tokens = tokenize('"hello"');
    const str = tokens.find((t) => t.type === "STRING");
    expect(str?.value).toBe("hello");
  });

  it("tokenizes keywords", () => {
    const tokens = tokenize("inteiro texto logico");
    expect(tokens.filter((t) => t.type === "KEYWORD")).toHaveLength(3);
  });

  it("tokenizes operators", () => {
    const tokens = tokenize("+ - * / = == != < > <= >=");
    const ops = tokens.filter((t) => t.type === "OPERATOR");
    expect(ops.length).toBeGreaterThanOrEqual(10);
  });

  it("tokenizes punctuation", () => {
    const tokens = tokenize("( ) [ ] { } , ; :");
    const punct = tokens.filter((t) => t.type === "PUNCTUATION");
    expect(punct).toHaveLength(9);
  });

  it("preserves line numbers", () => {
    const tokens = tokenize("inteiro x\nmostrar(x)");
    const lines = tokens.filter((t) => t.type !== "NEWLINE" && t.type !== "EOF").map((t) => t.line);
    expect(lines).toContain(1);
    expect(lines).toContain(2);
  });

  it("handles block comments", () => {
    const tokens = tokenize("/* comentario */\nmostrar(1)");
    const keywords = tokens.filter((t) => t.type === "KEYWORD" && t.value === "mostrar");
    expect(keywords).toHaveLength(1);
  });

  it("handles line comments with #", () => {
    const tokens = tokenize("# comentario\nmostrar(1)");
    const keywords = tokens.filter((t) => t.type === "KEYWORD" && t.value === "mostrar");
    expect(keywords).toHaveLength(1);
  });

  it("handles Windows \\r\\n line endings", () => {
    const tokens = tokenize("inteiro x\r\nmostrar(x)");
    const keywords = tokens.filter((t) => t.type === "KEYWORD" && t.value === "mostrar");
    expect(keywords).toHaveLength(1);
  });

  it("handles BOM at start of file", () => {
    const tokens = tokenize("\uFEFFmostrar(1)");
    const keywords = tokens.filter((t) => t.type === "KEYWORD" && t.value === "mostrar");
    expect(keywords).toHaveLength(1);
  });

  it("handles escape sequences in strings", () => {
    const tokens = tokenize('"ola\\nmundo"');
    const str = tokens.find((t) => t.type === "STRING");
    expect(str?.value).toBe("ola\nmundo");
  });

  it("handles \\r escape in strings", () => {
    const tokens = tokenize('"ola\\rmundo"');
    const str = tokens.find((t) => t.type === "STRING");
    expect(str?.value).toBe("ola\rmundo");
  });

  it("handles \\0 escape in strings", () => {
    const tokens = tokenize('"ola\\0mundo"');
    const str = tokens.find((t) => t.type === "STRING");
    expect(str?.value).toBe("ola\0mundo");
  });

  it("tokenizes break/continue keywords", () => {
    const tokens = tokenize("pare continua");
    const keywords = tokens.filter((t) => t.type === "KEYWORD");
    expect(keywords).toHaveLength(2);
    expect(keywords.map((k) => k.value)).toContain("pare");
    expect(keywords.map((k) => k.value)).toContain("continua");
  });

  it("throws on unclosed block comment", () => {
    expect(() => tokenize("/* unclosed")).toThrow();
  });

  it("throws on unclosed string", () => {
    expect(() => tokenize('"unclosed')).toThrow();
  });

  it("throws on unknown characters", () => {
    expect(() => tokenize("@")).toThrow();
  });

  it("throws on incomplete escape sequence at EOF", () => {
    expect(() => tokenize('"ola\\')).toThrow();
  });
});
