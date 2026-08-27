#!/usr/bin/env bun

import { tokenize } from "./tokenizer.js";
import { parse } from "./parser.js";
import { Interpreter, InputRequestError } from "./interpreter.js";
import * as fs from "fs";
import * as path from "path";

const VERSION = "1.0.0";
const MAX_FILE_SIZE = 1024 * 1024; // 1MB

function printHelp() {
  console.log(`
Algori v${VERSION} — Linguagem de programação em português

Uso:
  algori <arquivo.algori>          Executar um programa
  algori --help                    Mostrar esta ajuda
  algori --version                 Mostrar versão

Exemplo:
  algori meuprograma.algori
`);
}

function printVersion() {
  console.log(`Algori v${VERSION}`);
}

async function readLine(prompt: string): Promise<string> {
  const stdin = process.stdin;
  stdin.setRawMode?.(false);
  stdin.resume();
  stdin.setEncoding("utf-8");

  process.stdout.write(prompt);

  return new Promise<string>((resolve) => {
    stdin.once("data", (data: string) => {
      resolve(data.trim());
    });
    stdin.once("end", () => {
      resolve("");
    });
  });
}

async function runFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`Erro: Arquivo "${filePath}" não encontrado.`);
    process.exit(1);
  }

  if (!filePath.endsWith(".algori")) {
    console.error("Erro: Arquivo deve ter extensão .algori");
    process.exit(1);
  }

  const stat = fs.statSync(filePath);
  if (stat.size > MAX_FILE_SIZE) {
    console.error(`Erro: Arquivo muito grande (${Math.round(stat.size / 1024)}KB). Limite: 1MB.`);
    process.exit(1);
  }

  const code = fs.readFileSync(filePath, "utf-8");

  const tokens = tokenize(code);
  const ast = parse(tokens);
  const interpreter = new Interpreter();

  try {
    interpreter.run(ast);
  } catch (err) {
    if (err instanceof InputRequestError) {
      await handleInput(interpreter, ast, err);
    } else {
      console.error((err as Error).message);
      process.exit(1);
    }
  }

  printOutput(interpreter);
}

async function handleInput(
  interpreter: Interpreter,
  ast: ReturnType<typeof parse>,
  err: InputRequestError
) {
  const input = await readLine(err.prompt);
  const parts = input.split(/[,;]/).map((v) => v.trim());

  if (err.args && err.args.length > 0) {
    err.args.forEach((varName: string, i: number) => {
      if (varName) {
        const raw = parts[i] ?? "";
        let parsed: unknown = raw;
        if (raw === "verdadeiro" || raw === "true") parsed = true;
        else if (raw === "falso" || raw === "false") parsed = false;
        else if (!isNaN(Number(raw)) && raw !== "") parsed = Number(raw);
        interpreter.variables.set(varName, parsed);
      }
    });
  }

  try {
    interpreter.run(ast);
  } catch (e) {
    if (e instanceof InputRequestError) {
      await handleInput(interpreter, ast, e);
    } else {
      throw e;
    }
  }
}

function printOutput(interpreter: Interpreter) {
  for (const line of interpreter.console) {
    if (line.type === "output") {
      process.stdout.write(line.text + "\n");
    }
  }
}

const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  printVersion();
  process.exit(0);
}

const filePath = path.resolve(args[0]);
runFile(filePath);
