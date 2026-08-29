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
  algori --help / -h               Mostrar esta ajuda
  algori --version / --versao      Mostrar versão
  algori --update / --atualizar    Verificar e instalar atualização

Exemplo:
  algori meuprograma.algori
`);
}

function printVersion() {
  console.log(`Algori v${VERSION}`);
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return 1;
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return -1;
  }
  return 0;
}

function detectPlatform(): string {
  const os = process.platform;
  const arch = process.arch;
  const osName = os === "darwin" ? "macos" : os === "win32" ? "windows" : "linux";
  const archName = arch === "arm64" ? "arm64" : "x64";
  return `${osName}-${archName}`;
}

async function fetchLatestVersion(): Promise<string | null> {
  try {
    const res = await fetch("https://api.github.com/repos/wanfranklin/algori/releases/latest");
    if (!res.ok) return null;
    const data = await res.json() as { tag_name?: string };
    return data.tag_name?.replace(/^v/, "") ?? null;
  } catch {
    return null;
  }
}

async function runUpdate() {
  const platform = detectPlatform();
  console.log(`Versão atual: v${VERSION}`);
  console.log("Verificando atualizações...");

  const latest = await fetchLatestVersion();
  if (!latest) {
    console.error("Erro: Não foi possível verificar a versão mais recente.");
    console.error("Verifique sua conexão com a internet.");
    process.exit(1);
  }

  console.log(`Versão mais recente: v${latest}`);

  if (compareVersions(latest, VERSION) <= 0) {
    console.log("Você já está na versão mais recente!");
    return;
  }

  console.log(`\nAtualizando de v${VERSION} para v${latest}...`);

  const filename = `algori-${platform}`;
  const url = `https://github.com/wanfranklin/algori/releases/download/v${latest}/${filename}`;

  const currentBin = process.argv[1];
  const tmpFile = `${currentBin}.tmp`;

  try {
    const { execSync } = await import("child_process");
    execSync(`curl -fsSL -o "${tmpFile}" "${url}"`, { stdio: "inherit" });
    execSync(`chmod +x "${tmpFile}"`, { stdio: "inherit" });
    execSync(`mv "${tmpFile}" "${currentBin}"`, { stdio: "inherit" });
    console.log(`\nAtualizado com sucesso para v${latest}!`);
  } catch (e) {
    console.error("Erro ao baixar ou instalar a atualização.");
    try {
      const fs = await import("fs");
      fs.unlinkSync(tmpFile);
    } catch {}
    process.exit(1);
  }
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

  let ast;
  try {
    ast = parse(tokens);
  } catch (err) {
    console.error(formatError(err as Error));
    process.exit(1);
  }

  const interpreter = new Interpreter();

  try {
    interpreter.run(ast);
  } catch (err) {
    if (err instanceof InputRequestError) {
      const resumeIndex = ast.findIndex((n) => n.line === interpreter.currentLine) + 1;
      await handleInput(interpreter, ast, err, resumeIndex);
    } else {
      console.error(formatError(err as Error));
      process.exit(1);
    }
  }

  printOutput(interpreter);
}

async function handleInput(
  interpreter: Interpreter,
  ast: ReturnType<typeof parse>,
  err: InputRequestError,
  resumeIndex: number = 0
) {
  printOutput(interpreter);

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
    interpreter.execBlockFrom(ast, resumeIndex);
  } catch (e) {
    if (e instanceof InputRequestError) {
      const nextIndex = ast.findIndex((n) => n.line === interpreter.currentLine) + 1;
      await handleInput(interpreter, ast, e, nextIndex);
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

function formatError(err: Error): string {
  const msg = err.message;
  const parts = msg.split("|||");
  if (parts.length === 1) return msg;

  let output = parts[0];
  if (parts[1]) {
    output += `\n  Dica: ${parts[1]}`;
  }
  if (parts[2]) {
    output += `\n  Exemplo:\n    ${parts[2].replace(/\n/g, "\n    ")}`;
  }
  return output;
}

const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

if (args.includes("--version") || args.includes("--versao") || args.includes("-v")) {
  printVersion();
  process.exit(0);
}

if (args.includes("--update") || args.includes("--atualizar")) {
  await runUpdate();
  process.exit(0);
}

const filePath = path.resolve(args[0]);
runFile(filePath);
