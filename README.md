<div align="center">

# 🧠 Algori

### Linguagem de programação em português para aprendizado de algoritmos

[![Versão](https://img.shields.io/badge/v1.1.0-blue.svg)](https://github.com/wanfranklin/algori/releases)
[![Licença](https://img.shields.io/badge/Licença-GPL--3.0--or--later-green.svg)](LICENSE)
[![Testes](https://img.shields.io/badge/testes-passando-brightgreen.svg)](https://github.com/wanfranklin/algori/actions)

[Documentação](https://wanfranklin.github.io/algori/linguagem/) • [Guia do Professor](GUIA_PROFESSOR.md) • [Guia do Aluno](GUIA_ALUNO.md) • [Referência](REFERENCIA_LINGUAGEM.md)

</div>

---

## Exemplo Rápido

```algori
algori "OlaMundo"

mostrar("Olá, Mundo!")
```

---

## Instalação

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/wanfranklin/algori/main/install.sh | sh
```

### Windows

```powershell
irm https://raw.githubusercontent.com/wanfranklin/algori/main/install.ps1 | iex
```

### Outros métodos

| Método | Comando |
|--------|---------|
| **Homebrew** | `brew tap wanfranklin/tap && brew install algori` |
| **WinGet** | `winget install wanfranklin.algori` |
| **npm** | `npm install -g @algori/core` |
| **Debian/Ubuntu** | `sudo dpkg -i algori_1.1.0_amd64.deb` |
| **Download** | [GitHub Releases](https://github.com/wanfranklin/algori/releases) |

---

## Atualizar

### Via CLI

```bash
algori atualizar
```

### Via script

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/wanfranklin/algori/main/scripts/update.sh | sh

# Windows
irm https://raw.githubusercontent.com/wanfranklin/algori/main/scripts/update.ps1 | iex
```

### Outros métodos

| Método | Comando |
|--------|---------|
| **Homebrew** | `brew upgrade algori` |
| **npm** | `npm update -g @algori/core` |
| **WinGet** | `winget upgrade wanfranklin.algori` |

---

## Uso

```bash
algori executar <arquivo>    Executar um programa
algori novo [nome]          Criar um novo programa
algori ajuda                Mostrar ajuda
algori versao               Mostrar versão
algori atualizar            Atualizar para nova versão
```

### Flags de Execução

```bash
--debug                     Modo debug (mostra cada instrução)
--timeout <ms>              Tempo máximo de execução
--max-recursion <n>         Limite de recursão (padrão: 100)
--max-loop-iterations <n>   Limite por loop (padrão: 10.000)
--max-iter <n>              Limite total de passos (padrão: 1.000.000)
```

**Exemplo:**

```bash
algori executar prog.algori --debug --timeout 5000
```

---

## Funcionalidades

| Recurso | Exemplo |
|---------|---------|
| Variáveis tipadas | `inteiro x = 5` |
| Constantes | `constante PI = 3.14` |
| Arrays / Matrizes | `inteiro vetor[10]` / `real matriz[3][4]` |
| Laço para | `para (inteiro i = 0; i < 10; i = i + 1) { ... }` |
| Laço enquanto | `enquanto (x < 10) { ... }` |
| Condicionais | `se (x > 0) { ... } senao { ... }` |
| Funções | `funcao inteiro soma(inteiro a, inteiro b) { retorne a + b }` |
| Entrada/Saída | `mostrar(...)` / `capturar(...)` |
| Break / Continue | `pare` / `continua` |

---

## Como Biblioteca (npm)

```bash
npm install @algori/core
```

```typescript
import { tokenize, parse, Interpreter } from '@algori/core';

const tokens = tokenize('mostrar("Olá!")');
const ast = parse(tokens);
const interpreter = new Interpreter();
interpreter.run(ast);

console.log(interpreter.console[0].text); // "Olá!"
```

### Opções do Interpreter

```typescript
new Interpreter({
  debugMode?: boolean,        // Modo debug (padrão: false)
  timeoutMs?: number,         // Timeout em ms (0 = desligado)
  maxCallStackDepth?: number, // Limite de recursão (padrão: 100)
  maxLoopIterations?: number, // Limite por loop (padrão: 10.000)
  maxIterations?: number,     // Limite total (padrão: 1.000.000)
})
```

---

## Desinstalar

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/wanfranklin/algori/main/scripts/uninstall-unix.sh | sh

# Windows
irm https://raw.githubusercontent.com/wanfranklin/algori/main/scripts/uninstall-windows.ps1 | iex
```

---

## Contribuindo

Leia o [CONTRIBUTING.md](CONTRIBUTING.md) para configurar o ambiente e enviar pull requests.

---

## Licença

GPL-3.0-or-later
