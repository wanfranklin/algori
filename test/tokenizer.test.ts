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

  it("throws on unclosed block comment", () => {
    expect(() => tokenize("/* unclosed")).toThrow();
  });

  it("throws on unknown characters", () => {
    expect(() => tokenize("@")).toThrow();
  });
});
