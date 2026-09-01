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
| 🐛 **Modo Debug** | Visualize cada passo da execução com `--debug` |
| 🛡️ **Limites de Segurança** | Proteção contra loops infinitos e recursão excessiva |
| 📊 **Stack Traces Melhorados** | Erros com contexto completo: código, dica, call stack e tempo |

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

## 🔄 Atualizar

### Via CLI (recomendado)

```bash
algori atualizar
```

Ou em inglês:

```bash
algori update
```

O comando verifica a versão mais recente no GitHub e baixa o executável automaticamente.

### Por método de instalação

| Método | Comando de atualização |
|--------|----------------------|
| **CLI** | `algori atualizar` |
| **Homebrew** | `brew upgrade algori` |
| **npm** | `npm update -g @algori/core` |
| **WinGet** | `winget upgrade wanfranklin.algori` |
| **Download direto** | Baixe a nova versão em [Releases](https://github.com/wanfranklin/algori/releases) |

### Verificar versão atual

```bash
algori versao
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

### Flags de Execução

```bash
algori executar prog.algori --debug              # Modo debug (mostra cada instrução)
algori executar prog.algori --timeout 5000       # Timeout em milissegundos
algori executar prog.algori --max-recursion 50   # Limite de recursão (padrão: 100)
algori executar prog.algori --max-loop-iterations 5000  # Limite por loop (padrão: 10.000)
algori executar prog.algori --max-iter 100000    # Limite total de passos (padrão: 1.000.000)
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
| `new Interpreter(options?)` | Cria uma instância do interpretador |
| `interpreter.run(ast, sourceCode?)` | Executa a AST |
| `interpreter.console` | Array de linhas de saída |
| `interpreter.variables` | Mapa de variáveis e seus valores |
| `interpreter.functions` | Mapa de funções definidas |
| `interpreter.debugLog` | Array de mensagens de debug (quando debugMode=true) |

### Opções do Interpreter

```typescript
new Interpreter({
  debugMode?: boolean;        // Ativa logging de debug (padrão: false)
  timeoutMs?: number;         // Timeout em ms (0 = desligado)
  maxCallStackDepth?: number; // Limite de recursão (padrão: 100)
  maxLoopIterations?: number; // Limite por loop (padrão: 10.000)
  maxIterations?: number;     // Limite total de passos (padrão: 1.000.000)
})
```

Veja a documentação completa em [Referência da Linguagem](REFERENCIA_LINGUAGEM.md).

---

## 🐛 Modo Debug

O modo debug permite visualizar cada passo da execução do programa.

### Ativar via CLI

```bash
algori executar meuprograma.algori --debug
```

### Exemplo de saída

```
[DEBUG] Iniciando execução (5 nós, timeout: desligado)
[DEBUG L4] print
[DEBUG L5] var_decl
[DEBUG L6] var_decl (minhaFuncao) [0ms]
[DEBUG L7] var_decl (minhaFuncao) [0ms]
[DEBUG L8] print (minhaFuncao) [0ms]
[DEBUG] Execução concluída: 5 iterações, 0ms
[DEBUG] Variáveis finais: {x: 10, y: 20, resultado: 30}
```

### Informações exibidas

| Campo | Descrição |
|-------|-----------|
| `[DEBUG L{número}]` | Número da linha sendo executada |
| `(nomeFuncao)` | Call stack atual (se dentro de funções) |
| `[tempo]` | Tempo decorrido desde o início |
| Variáveis finais | Estado final de todas as variáveis |

### Usando como biblioteca

```typescript
import { tokenize, parse, Interpreter } from '@algori/core';

const interpreter = new Interpreter({ debugMode: true });
const tokens = tokenize(code);
const ast = parse(tokens);
interpreter.run(ast);

// Logs de debug também ficam disponíveis em interpreter.debugLog
console.log(interpreter.debugLog);
```

---

## 🛡️ Limites de Segurança

O Algori inclui proteções contra execução descontrolada.

### Flags disponíveis

| Flag | Padrão | Descrição |
|------|--------|-----------|
| `--timeout <ms>` | 0 (desligado) | Tempo máximo de execução em milissegundos |
| `--max-recursion <n>` | 100 | Profundidade máxima de recursão |
| `--max-loop-iterations <n>` | 10.000 | Iterações máximas por loop |
| `--max-iter <n>` | 1.000.000 | Total de passos de execução |

### Exemplos

```bash
# Timeout de 5 segundos
algori executar prog.algori --timeout 5000

# Limite de recursão em 50 chamadas
algori executar prog.algori --max-recursion 50

# Loop com no máximo 1000 iterações
algori executar prog.algori --max-loop-iterations 1000

# Combinar flags
algori executar prog.algori --timeout 10000 --max-recursion 200
```

### Usando como biblioteca

```typescript
const interpreter = new Interpreter({
  timeoutMs: 5000,           // 5 segundos
  maxCallStackDepth: 50,     // 50 níveis de recursão
  maxLoopIterations: 1000,   // 1000 iterações por loop
  maxIterations: 500000,     // 500.000 passos totais
});
```

### Erros de segurança

Quando um limite é excedido, o interpretador lança um `RuntimeError` com contexto completo:

```
Linha 8: Profundidade máxima de recursão (100) excedida
  Código: retorne fib(n - 1) + fib(n - 2)
  Dica: Verifique se as chamadas recursivas têm condição de parada.
  Em: fib → fib → fib → fib → fib → fib → fib
  Tempo: 45ms
```

---

## 📊 Stack Traces Melhorados

Erros agora incluem contexto completo para diagnóstico rápido.

### Informações incluídas

| Campo | Descrição |
|-------|-----------|
| **Linha** | Número da linha com o erro |
| **Mensagem** | Descrição do erro |
| **Código** | Linha de código que causou o erro |
| **Dica** | Sugestão de como corrigir |
| **Exemplo** | Código de exemplo para resolver |
| **Em** | Call stack completo com todas as chamadas |
| **Tempo** | Tempo decorrido desde o início da execução |

### Exemplo: Erro de recursão

```
Linha 8: Profundidade máxima de recursão (100) excedida
  Código: retorne fib(n - 1) + fib(n - 2)
  Dica: Verifique se as chamadas recursivas têm condição de parada.
  Exemplo:
    funcao inteiro fatorial(n)
      se (n <= 1) entao
        retorne 1
      senao
        retorne n * fatorial(n - 1)
      fim
  Em: fib → fib → fib → fib → fib → fib → fib
  Tempo: 45ms
```

### Exemplo: Divisão por zero

```
Linha 3: Divisão por zero
  Código: mostrar(10 / 0)
  Dica: Verifique se o divisor é diferente de zero.
  Exemplo:
    se (divisor != 0) entao
      resultado = numerador / divisor
    fimSe
  Tempo: 0ms
```

### Exemplo: Loop infinito

```
Linha 5: Limite de 10000 iterações excedido no 'enquanto'
  Código: inteiro x = 1
  Dica: Verifique se há uma condição de saída no loop.
  Exemplo:
    enquanto (x < 10) faca
      x = x + 1
    fimEnquanto
  Tempo: 12ms
```

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

## 🐛 Correções e Melhorias Recentes (v1.0.0)

### Correções de Bugs

| Bug | Descrição |
|-----|-----------|
| `continua` + `para` estilo-C | `continua` agora executa o incremento antes de pular para a próxima iteração |
| `pare`/`continua` em funções | Sinais de controle que escapavam de funções agora geram `RuntimeError` |
| Mensagem de erro duplicada | `Linha X: Linha X:` não aparece mais em erros de parse/runtime |
| Variável local vazando | Variáveis declaradas dentro de funções não vazam mais para o escopo global |
| Matrizes 2D | Leitura e escrita com `matriz[i][j]` funcionando com bounds check por dimensão |
| Extensão VS Code | `console.log` substituído por output channel, tipos `node` resolvidos |

### Novas Funcionalidades

| Feature | Descrição |
|---------|-----------|
| **Modo Debug** | `--debug` mostra cada instrução, call stack e variáveis em tempo real |
| **Timeout de execução** | `--timeout <ms>` limita tempo máximo de execução |
| **Limite de recursão** | `--max-recursion <n>` previne stack overflow (padrão: 100) |
| **Limite de iterações por loop** | `--max-loop-iterations <n>` previne loops infinitos (padrão: 10.000) |
| **Limite total de passos** | `--max-iter <n>` limita execução total (padrão: 1.000.000) |
| **Stack traces completos** | Erros incluem código, dica, exemplo, call stack e tempo |
| **CI/CD com GitHub Actions** | Testes automáticos em PRs e pushes |
| **Coverage de testes** | Relatório HTML com Vitest + Codecov |
| **JSDoc completo** | Documentação nas APIs públicas para autocompletar IDE |

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
