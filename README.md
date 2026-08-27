<div align="center">

# 🧠 Algori

### Linguagem de programação em português para aprendizado de algoritmos

[![Versão](https://img.shields.io/badge/v1.0.0-blue.svg)](https://github.com/wanfranklin/algori/releases)
[![Licença](https://img.shields.io/badge/Licença-GPL--3.0--or--later-green.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/wanfranklin/algori/actions)
[![Testes](https://img.shields.io/badge/testes-51%20passando-brightgreen.svg)](https://github.com/wanfranklin/algori)

[Documentação](https://wanfranklin.github.io/algori/linguagem/) • [Instalação](#instalação) • [Exemplos](#exemplo) • [Contribuindo](CONTRIBUTING.md)

---

**Algori** é uma linguagem de programação tipada e de pseudocódigo projetada para o ensino de algoritmos e estruturas de dados em língua portuguesa.

</div>

---

## ✨ Por que Algori?

| Recurso | Descrição |
|---------|-----------|
| 🇧🇷 **Sintaxe em português** | Keywords como `mostrar`, `capturar`, `se`, `enquanto`, `funcao` |
| 📝 **Tipagem estática** | `inteiro`, `texto`, `logico`, `real`, `caractere` |
| ⚡ **Execução interativa** | Entrada via `capturar()` com prompt em tempo real |
| 🖥️ **Multiplataforma** | macOS, Linux e Windows |

---

## 🚀 Exemplo Rápido

### Com `algori`

```algori
algori "OlaMundo"

mostrar("Olá, Mundo!")
```

### Com `programa` (legado)

```
programa OlaMundo

mostrar("Olá, Mundo!")
```

### Sem cabeçalho

```
mostrar("Olá, Mundo!")
```

---

## 📦 Instalação

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/wanfranklin/algori/main/install.sh | sh
```

### Homebrew

```bash
brew tap wanfranklin/tap
brew install algori
```

### Windows

```bash
winget install wanfranklin.algori
```

### Outras opções

| Método | Comando |
|--------|---------|
| **Debian/Ubuntu** | `sudo dpkg -i algori_1.0.0_amd64.deb` |
| **Fedora/RHEL** | `sudo rpm -i algori-1.0.0-1.*.rpm` |
| **npm** | `npm install -g @algori/core` |
| **Download direto** | [GitHub Releases](https://github.com/wanfranklin/algori/releases) |

---

## 💻 Uso

### Criar um programa

Crie um arquivo `ola.algori`:

```
mostrar("Olá, Mundo!")
```

### Executar

```bash
algori ola.algori
```

### Comandos CLI

```bash
algori <arquivo.algori>   # Executar um programa
algori --help             # Mostrar ajuda
algori --version          # Mostrar versão
```

---

## 📚 Como Biblioteca (npm)

```typescript
import { tokenize, parse, Interpreter } from '@algori/core';

const code = `
algori "OlaMundo"
mostrar("Olá Mundo!")
`;

const tokens = tokenize(code);
const ast = parse(tokens);

const interpreter = new Interpreter();
interpreter.run(ast);

console.log(interpreter.console);
// [{ text: "Olá Mundo!", type: "output", ... }]
```

---

## 🎯 Funcionalidades da Linguagem

| Recurso | Exemplo |
|---------|---------|
| Variáveis tipadas | `inteiro x = 5` |
| Constantes | `constante PI = 3.14` |
| Arrays | `inteiro vetor[10]` |
| Laço para | `para (inteiro i = 0; i < 10; i = i + 1) { ... }` |
| Laço enquanto | `enquanto (x < 10) { ... }` |
| Condicionais | `se (x > 0) { ... } senao { ... }` |
| Funções | `funcao inteiro soma(inteiro a, inteiro b) { retorne a + b }` |
| Entrada/Saída | `mostrar(...)` / `capturar(...)` |
| Operadores lógicos | `e`, `ou`, `nao` |
| Divisão inteira | `a div b`, `a mod b` |

---

## 📁 Estrutura

```
algori/
├── src/                    # Código fonte
├── types/                  # Tipos TypeScript
├── test/                   # Testes (51 testes)
├── docs/                   # Documentação da linguagem
├── scripts/                # Scripts de build
├── packaging/              # Pacotes para gerenciadores
├── install.sh              # Script de instalação universal
└── package.json            # @algori/core
```

---

## 🔧 Build & Desenvolvimento

```bash
npm install           # Instalar dependências
npm run build         # Build da library
npm run test          # Executar testes
npm run lint          # Verificar código
./scripts/build.sh    # Build do executável standalone
```

### Release automática

O workflow `.github/workflows/release.yml` gera automaticamente executáveis, `.deb` e `.rpm`.

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 📄 Licença

GPL-3.0-or-later

---

<div align="center">

**Feito com ❤️ para a comunidade de programação em português**

[![GitHub](https://img.shields.io/badge/GitHub-wanfranklin%2Falgori-181717?style=flat&logo=github)](https://github.com/wanfranklin/algori)

</div>
