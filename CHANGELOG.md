# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.1.1] - 01/09/2026

### Corrigido

- `capturar()` como expressão agora funciona corretamente (ex: `inteiro opcao = capturar()`)
- Fluxo de execução não é mais reiniciado após receber input com `capturar()` como expressão
- Erro de sintaxe no parser (chave extra) corrigido

### Adicionado

- Suporte para `capturar()` e `ler()` como expressões em `parsePrimary()`
- Mecanismo de "suspend/resume" para fluxo de execução com input

## [1.1.0] - 31/08/2026

### Adicionado

- **Modo Debug** (`--debug`): mostra cada instrução executada, call stack e variáveis em tempo real
- **Limites de segurança**: `--timeout`, `--max-recursion`, `--max-loop-iterations`, `--max-iter`
- **Stack traces melhorados**: erros incluem código, dica, exemplo, call stack completo e tempo decorrido
- Subcomandos CLI em português: `algori executar`, `algori novo`, `algori ajuda`, `algori versao`, `algori atualizar`
- Suporte à extensão `.algx` além de `.algori`
- Scripts de atualização: `update.sh` (macOS/Linux) e `update.ps1` (Windows)
- Auto-detect de versão nos scripts de instalação (via GitHub API)
- `interpreter.debugLog` para acesso aos logs de debug via biblioteca
- `ErrorContext` com callStack, sourceLine e elapsed nos erros

### Corrigido

- Bug de múltiplas entradas com `capturar()`
- `pare`/`continua` escapando de funções agora gera `RuntimeError`
- `continua` no `para` estilo-C agora executa o incremento antes de pular
- Mensagem de erro duplicada (`Linha X: Linha X:`) removida
- Variáveis locais vazando para escopo global corrigido
- Matrizes 2D com bounds check por dimensão
- `parseExpressionToString` não utilizada removida

### Alterado

- README simplificado (~150 linhas)
- Scripts de instalação agora buscam versão mais recente automaticamente
- InterpreterOptions agora inclui `maxLoopIterations`

## [1.0.0] - 25/08/2026

### Adicionado

- Tokenizador com suporte a comentários de bloco (`/* */`)
- Parser com descida recursiva para AST completa
- Interpretador com execução passo a passo
- CLI com suporte a `capturar()` interativo
- Declaração de variáveis tipadas (`inteiro`, `texto`, `logico`, etc.)
- Constantes com `constante` (imutáveis)
- Arrays com `vetor[i] = expr` e índices dinâmicos
- Laços `para` (C-style e legado `de...ate...passo`)
- Laços `enquanto` com `faca`
- Condicionais `se`/`senao` com `entao`
- Funções com `funcao` e `retorne`
- Operadores aritméticos, lógicos e de comparação
- Expressões condicionais inline `se (cond) { val } senao { val }`
- Vetores e matrizes
- API pública para uso como biblioteca
- Web Worker para execução isolada
- 8 métodos de instalação (npm, curl, brew, winget, debian, rpm, windows, git)
- Testes unitários com Vitest (51 testes)
- Documentação da linguagem em HTML interativo

### Corrigido

- `mostrar()` agora exibe output antes de `capturar()` (buffer flush)
- `capturar()` não causa mais recursão infinita (resume execução)

### Adicionado (CLI)

- `algori --update` / `algori --atualizar` para atualização via GitHub Releases
- `algori --versao` como alias para `algori --version`
- Limites de segurança: tamanho de arquivo, iterações, caracteres desconhecidos

### Corrigido

- Bug de múltiplas entradas com `capturar()`
- Comentários de bloco não fechados agora lançam erro
- Caracteres desconhecidos agora lançam erro
- EOF em `readLine` tratado corretamente

### Alterado

- Estrutura de monorepo para projeto flat
- Renomeado de `@algori/engine` para `@algori/core`
