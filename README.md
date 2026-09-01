<div align="center">

# 🧠 Algori

### Linguagem de programação em português para aprendizado de algoritmos

[![Versão](https://img.shields.io/badge/v1.0.0-blue.svg)](https://github.com/wanfranklin/algori/releases)
[![Licença](https://img.shields.io/badge/Licença-GPL--3.0--or--later-green.svg)](LICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/wanfranklin/algori/ci.yml?branch=main&style=flat)](https://github.com/wanfranklin/algori/actions)
[![Testes](https://img.shields.io/badge/testes-passando-brightgreen.svg)](https://github.com/wanfranklin/algori/actions)
[![Coverage](https://img.shields.io/codecov/c/github/wanfranklin/algori?token=CODECOV_TOKEN)](https://codecov.io/gh/wanfranklin/algori)

[Documentação](https://wanfranklin.github.io/algori/linguagem/) • [Instalação](#instalação) • [Exemplos](#exemplo) • [Guia do Professor](GUIA_PROFESSOR.md) • [Guia do Aluno](GUIA_ALUNO.md) • [Contribuindo](CONTRIBUTING.md) • [Referência da Linguagem](REFERENCIA_LINGUAGEM.md)

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

#### Opção 1: Instalador Visual (recomendado para iniciantes)

Baixe o `AlgoriInstaller.exe` em [GitHub Releases](https://github.com/wanfranklin/algori/releases) e execute. Siga as instruções: **Próximo → Instalar → Finalizar**.

#### Opção 2: WinGet

```bash
winget install wanfranklin.algori
```

#### Opção 3: PowerShell (instalador automático)

```powershell
irm https://raw.githubusercontent.com/wanfranklin/algori/main/install.ps1 | iex
```

#### Opção 4: Inno Setup (instalador clássico)

Baixe o instalador `algori-*-setup.exe` em [GitHub Releases](https://github.com/wanfranklin/algori/releases) e execute.

#### Opção 5: Download direto

Baixe o executável `algori-windows-x64.exe` em [GitHub Releases](https://github.com/wanfranklin/algori/releases), renomeie para `algori.exe` e adicione ao PATH do sistema.

### Outras opções

| Método | Comando |
|--------|---------|
| **Debian/Ubuntu** | `sudo dpkg -i algori_1.0.0_amd64.deb` |
| **Fedora/RHEL** | `sudo rpm -i algori-1.0.0-1.*.rpm` |
| **npm** | `npm install -g @algori/core` |
| **Download direto** | [GitHub Releases](https://github.com/wanfranklin/algori/releases) |

---

## 🚀 Executar após a instalação

### No VSCode

1. Abra o VSCode
2. Crie um arquivo `ola.algori` com seu código
3. Abra o terminal integrado: `` Ctrl+` ``
4. Execute:

```bash
algori ola
```

### No PowerShell

1. Abra o PowerShell (procure "PowerShell" no menu Iniciar)
2. Navegue até a pasta do arquivo:

```powershell
cd C:\Users\SeuUsuario\Documents
```

3. Execute:

```powershell
algori ola
```

### No Prompt de Comando (cmd)

1. Abra o Prompt de Comando (procure "cmd" no menu Iniciar)
2. Navegue até a pasta do arquivo:

```cmd
cd C:\Users\SeuUsuario\Documents
```

3. Execute:

```cmd
algori ola
```

> **Nota:** Após a instalação, pode ser necessário fechar e reabrir o terminal para que o comando `algori` seja reconhecido.

---

## 🔍 Verificar Pré-requisitos

Antes de instalar, você pode verificar se seu sistema atende aos requisitos:

### Windows

```powershell
irm https://raw.githubusercontent.com/wanfranklin/algori/main/scripts/check-windows.ps1 | iex
```

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/wanfranklin/algori/main/scripts/check-unix.sh | sh
```

---

## 🗑️ Desinstalar

### Windows

```powershell
irm https://raw.githubusercontent.com/wanfranklin/algori/main/scripts/uninstall-windows.ps1 | iex
```

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/wanfranklin/algori/main/scripts/uninstall-unix.sh | sh
```

---

## 💻 Uso

### Criar um programa

Crie um arquivo `ola.algori`:

```
mostrar("Olá, Mundo!")
```

### Executar

```bash
algori ola
```

### Comandos CLI

```bash
algori executar <arquivo>           Executar um programa
algori novo [nome]                 Criar um novo programa
algori ajuda                       Mostrar ajuda
algori versao                      Mostrar versão
algori atualizar                   Verificar e instalar atualização

# Atalhos em inglês (funcionam também)
algori run <arquivo>
algori new [nome]
algori help
algori version
algori update

# Legado (ainda funciona)
algori <arquivo>
```

---

## 📚 Como Biblioteca (npm)

### Instalação

```bash
npm install @algori/core
```

### Exemplo básico

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

### Exemplo com variáveis

```typescript
import { tokenize, parse, Interpreter } from '@algori/core';

const code = `
algori "Calculadora"
inteiro a = 5
inteiro b = 3
mostrar("Soma: ", a + b)
mostrar("Produto: ", a * b)
`;

const tokens = tokenize(code);
const ast = parse(tokens);
const interpreter = new Interpreter();
interpreter.run(ast);

interpreter.console.forEach(line => console.log(line.text));
// Soma: 8
// Produto: 15
```

### Exemplo com funções

```typescript
import { tokenize, parse, Interpreter } from '@algori/core';

const code = `
algori "Funcoes"

funcao inteiro fatorial(inteiro n) {
  se (n <= 1) retorne 1
  retorne n * fatorial(n - 1)
}

mostrar("5! = ", fatorial(5))
`;

const interpreter = new Interpreter();
const tokens = tokenize(code);
const ast = parse(tokens);
interpreter.run(ast);

console.log(interpreter.console[0].text); // "5! = 120"
```

### API Pública

| Função | Descrição |
|--------|----------|
| `tokenize(source)` | Converte código-fonte em tokens |
| `parse(tokens)` | Converte tokens em AST (Abstract Syntax Tree) |
| `new Interpreter()` | Cria uma instância do interpretador |
| `interpreter.run(ast)` | Executa a AST |
| `interpreter.console` | Array de linhas de saída |
| `interpreter.variables` | Mapa de variáveis e seus valores |
| `interpreter.functions` | Mapa de funções definidas |

Veja a documentação completa em [Referência da Linguagem](REFERENCIA_LINGUAGEM.md).

---

## 🎯 Funcionalidades da Linguagem

| Recurso | Exemplo |
|---------|---------|
| Variáveis tipadas | `inteiro x = 5` |
| Constantes | `constante PI = 3.14` |
| Arrays 1D | `inteiro vetor[10]` |
| Matrizes 2D | `real matriz[3][4]` |
| Laço para (estilo-C) | `para (inteiro i = 0; i < 10; i = i + 1) { ... }` |
| Laço para (legado) | `para i de 1 ate 10 { ... }` |
| Laço enquanto | `enquanto (x < 10) { ... }` |
| Condicionais | `se (x > 0) { ... } senao { ... }` |
| Funções com retorno | `funcao inteiro soma(inteiro a, inteiro b) { retorne a + b }` |
| Entrada/Saída | `mostrar(...)` / `capturar(...)` |
| Operadores lógicos | `e`, `ou`, `nao` |
| Divisão inteira | `a div b`, `a mod b` |
| Break / Continue | `pare` / `continua` |

---

## 🐛 Correções Recentes (v1.0.0)

| Bug | Descrição |
|-----|-----------|
| `continua` + `para` estilo-C | `continua` agora executa o incremento antes de pular para a próxima iteração |
| `pare`/`continua` em funções | Sinais de controle que escapavam de funções agora geram `RuntimeError` |
| Mensagem de erro duplicada | `Linha X: Linha X:` não aparece mais em erros de parse/runtime |
| Variável local vazando | Variáveis declaradas dentro de funções não vazam mais para o escopo global |
| Matrizes 2D | Leitura e escrita com `matriz[i][j]` funcionando com bounds check por dimensão |
| Extensão VS Code | `console.log` substituído por output channel, tipos `node` resolvidos |

---

## 📁 Estrutura

```
algori/
├── src/                    # Código fonte (tokenizer, parser, interpretador)
├── types/                  # Tipos TypeScript
├── test/                   # Testes (97 testes)
├── extensions/vscode/      # Extensão VS Code
├── docs/                   # Documentação da linguagem
├── scripts/                # Scripts de build
├── packaging/              # Pacotes para gerenciadores
├── exemplos/               # Exemplos de código
├── install.sh              # Script de instalação universal
└── package.json            # @algori/core
```

---

## 🔧 Build & Desenvolvimento

### Instalação de dependências

```bash
npm install
```

### Comandos disponíveis

| Comando | Descrição |
|---------|----------|
| `npm run build` | Compila TypeScript para JavaScript |
| `npm run test` | Executa testes com Vitest |
| `npm run coverage` | Gera relatório de coverage |
| `npm run lint` | Verifica código com oxlint |
| `npm run build:cli` | Build CLI como bundle |
| `npm run build:exe` | Build executável com Bun |

### CI/CD Automático

O projeto usa GitHub Actions para:
- ✅ Executar testes em Python 18.x, 20.x, 22.x
- ✅ Verificar linting com oxlint
- ✅ Gerar relatório de coverage
- ✅ Fazer upload para Codecov

Os testes rodam automaticamente em:
- Cada push para `main` ou `develop`
- Cada pull request
- Múltiplas plataformas (Linux, macOS, Windows)

Ver status em: [GitHub Actions](https://github.com/wanfranklin/algori/actions)

### Release automática

O workflow `.github/workflows/release.yml` gera automaticamente:
- Executáveis (Windows, macOS, Linux)
- Pacotes Debian (.deb) e RPM (.rpm)
- Versão npm

Para fazer um release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Leia o [CONTRIBUTING.md](CONTRIBUTING.md) para:
- Como configurar o ambiente
- Padrões de código
- Como rodar testes e linting
- Como enviar uma pull request

---

## 🎓 Para Professores e Alunos

### Guia do Professor

Acesse o [Guia do Professor](GUIA_PROFESSOR.md) para:
- Configurar o laboratório de informática
- Planejar aulas com Algori
- Acessar exercícios prontos
- Solucionar problemas comuns

### Guia do Aluno

Acesse o [Guia do Aluno](GUIA_ALUNO.md) para:
- Aprender a usar o Algori
- Ver comandos básicos
- Tirar dúvidas frequentes

### Exercícios Prontos

A pasta [exemplos/aula/](exemplos/aula/) contém exercícios prontos para usar em aula.

### Extensão VSCode

A extensão VSCode oferece:
- Syntax highlighting para Algori
- Autocomplete de palavras-chave
- Snippets para código comum
- Execução integrada

Veja mais em [extensions/vscode/](extensions/vscode/).

### Modo Portátil (USB)

Execute o Algori de qualquer computador sem instalar nada. Veja em [packaging/portable/](packaging/portable/).

---

## 📄 Licença

GPL-3.0-or-later

---

<div align="center">

**Feito com ❤️ para a comunidade de programação em português**

[![GitHub](https://img.shields.io/badge/GitHub-wanfranklin%2Falgori-181717?style=flat&logo=github)](https://github.com/wanfranklin/algori)

</div>
