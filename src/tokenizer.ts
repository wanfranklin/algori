import type { Token, TokenType } from "../types/index.js";

const KEYWORDS = new Set([
  "algori",
  "programa",
  // Legacy block delimiters (kept for backward compat)
  "inicio",
  "fim",
  "fimse",
  "fimenquanto",
  "fimpara",
  // Types
  "inteiro",
  "real",
  "decimal",
  "caractere",
  "texto",
  "logico",
  "vetor",
  "matriz",
  "vazio",
  // Declarations
  "constante",
  "tipo",
  "procedimento",
  "funcao",
  "retorne",
  // I/O
  "escreva",
  "escrevaln",
  "leia",
  "mostrar",
  "capturar",
  "ler",
  // Control flow
  "se",
  "entao",
  "senao",
  "enquanto",
  "faca",
  "para",
  "de",
  "ate",
  "passo",
  // Boolean
  "verdadeiro",
  "falso",
  // Logic (word-style)
  "nao",
  "e",
  "ou",
  "mod",
  "div",
  // Variable block
  "var",
]);

const TOKEN_MAP: Record<string, TokenType> = {
  "+": "OPERATOR",
  "-": "OPERATOR",
  "*": "OPERATOR",
  "/": "OPERATOR",
  "%": "OPERATOR",
  "=": "OPERATOR",
  "<": "OPERATOR",
  ">": "OPERATOR",
  "!": "OPERATOR",
  "<=": "OPERATOR",
  ">=": "OPERATOR",
  "==": "OPERATOR",
  "!=": "OPERATOR",
  "&&": "OPERATOR",
  "||": "OPERATOR",
  "(": "PUNCTUATION",
  ")": "PUNCTUATION",
  "[": "PUNCTUATION",
  "]": "PUNCTUATION",
  ",": "PUNCTUATION",
  ":": "PUNCTUATION",
  ";": "PUNCTUATION",
  "{": "PUNCTUATION",
  "}": "PUNCTUATION",
};

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let col = 1;

  function peek(): string {
    return pos < source.length ? source[pos] : "\0";
  }

  function peek2(): string {
    return pos + 1 < source.length ? source[pos + 1] : "\0";
  }

  function advance(): string {
    const ch = source[pos++];
    if (ch === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
    return ch;
  }

  function addToken(type: TokenType, value: string, l: number, c: number) {
    tokens.push({ type, value, line: l, col: c });
  }

  while (pos < source.length) {
    const startLine = line;
    const startCol = col;
    const ch = peek();

    if (ch === "\n") {
      advance();
      addToken("NEWLINE", "\n", startLine, startCol);
      continue;
    }

    if (ch === " " || ch === "\t" || ch === "\r") {
      advance();
      continue;
    }

    if (ch === "/" && peek2() === "/") {
      while (pos < source.length && peek() !== "\n") {
        advance();
      }
      continue;
    }

    if (ch === "/" && peek2() === "*") {
      const commentStartLine = line;
      advance();
      advance();
      while (pos < source.length && !(peek() === "*" && peek2() === "/")) {
        advance();
      }
      if (pos >= source.length) {
        throw new Error(`Linha ${commentStartLine}: Comentário de bloco não fechado|||Adicione "*/" para fechar o comentário.|||/* comentário */`);
      }
      advance();
      advance();
      continue;
    }

    if (ch === "#") {
      while (pos < source.length && peek() !== "\n") {
        advance();
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = advance();
      const startLine = line;
      let str = "";
      while (pos < source.length && peek() !== quote) {
        if (peek() === "\\") {
          advance();
          if (pos >= source.length) {
            throw new Error(`Linha ${startLine}: Sequência de escape incompleta|||Escape de string não terminado no final do arquivo.|||"Olá\\nMundo"`);
          }
          const esc = advance();
          if (esc === "n") str += "\n";
          else if (esc === "t") str += "\t";
          else if (esc === "\\") str += "\\";
          else if (esc === quote) str += quote;
          else str += esc;
        } else {
          str += advance();
        }
      }
      if (pos >= source.length) {
        throw new Error(`Linha ${startLine}: String não terminada|||Fechamento de aspas não encontrado.|||"Texto entre aspas"`);
      }
      advance();
      addToken("STRING", str, startLine, startCol);
      continue;
    }

    if (ch >= "0" && ch <= "9") {
      let num = "";
      while (pos < source.length && ((peek() >= "0" && peek() <= "9") || peek() === ".")) {
        num += advance();
      }
      addToken("NUMBER", num, startLine, startCol);
      continue;
    }

    if (ch === "." && peek2() !== ".") {
      let word = advance();
      while (pos < source.length && peek() !== "." && peek() !== "\n" && peek() !== " ") {
        word += advance();
      }
      if (peek() === ".") {
        advance();
        const inner = word.toLowerCase();
        if (inner === "verdadeiro") {
          addToken("STRING", "true", startLine, startCol);
        } else if (inner === "falso") {
          addToken("STRING", "false", startLine, startCol);
        } else if (inner === "e") {
          addToken("KEYWORD", "e", startLine, startCol);
        } else if (inner === "ou") {
          addToken("KEYWORD", "ou", startLine, startCol);
        } else if (inner === "nao") {
          addToken("KEYWORD", "nao", startLine, startCol);
        }
        continue;
      }
    }

    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_" || ch >= "\u00C0") {
      let id = "";
      while (
        pos < source.length &&
        ((peek() >= "a" && peek() <= "z") ||
          (peek() >= "A" && peek() <= "Z") ||
          (peek() >= "0" && peek() <= "9") ||
          peek() === "_" ||
          peek() >= "\u00C0")
      ) {
        id += advance();
      }
      const lower = id.toLowerCase();
      if (KEYWORDS.has(lower)) {
        if (lower === "verdadeiro") addToken("STRING", "true", startLine, startCol);
        else if (lower === "falso") addToken("STRING", "false", startLine, startCol);
        else addToken("KEYWORD", lower, startLine, startCol);
      } else {
        addToken("IDENTIFIER", id, startLine, startCol);
      }
      continue;
    }

    // Multi-char operators (&&, ||, <=, >=, ==, !=)
    if (ch === "&" && peek2() === "&") {
      advance(); advance();
      addToken("OPERATOR", "&&", startLine, startCol);
      continue;
    }
    if (ch === "|" && peek2() === "|") {
      advance(); advance();
      addToken("OPERATOR", "||", startLine, startCol);
      continue;
    }
    if (ch === "<" || ch === ">" || ch === "!" || ch === "=") {
      let op = advance();
      if (peek() === "=") {
        op += advance();
      }
      addToken(TOKEN_MAP[op] ?? "OPERATOR", op, startLine, startCol);
      continue;
    }

    if (TOKEN_MAP[ch]) {
      advance();
      addToken(TOKEN_MAP[ch], ch, startLine, startCol);
      continue;
    }

    // Caractere desconhecido
    throw new Error(`Linha ${startLine}: Caractere inválido '${ch}'|||Remova ou substitua este caractere.`);
  }

  addToken("EOF", "", line, col);
  return tokens;
}
