# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-08-25

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
