# Contribuindo para o Algori

Obrigado por contribuir com o Algori! Este guia explica como configurar o ambiente e enviar alterações.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/) (para compilar executáveis)
- [oxlint](https://oxc-project.github.io/oxc.rs/) (linting, instalado automaticamente)

## Setup

```bash
git clone https://github.com/wanfranklin/algori.git
cd algori
npm install
```

## Comandos úteis

| Comando | Descrição |
|---|---|
| `npm run build` | Compila TypeScript para JavaScript |
| `npm run lint` | Executa o linter |
| `npm run test` | Executa os testes |
| `npm run build:exe` | Compila executável com Bun |

## Estrutura do projeto

```
src/
  tokenizer.ts    Análise léxica
  parser.ts       Análise sintática (descida recursiva)
  interpreter.ts  Execução da AST
  cli.ts          Interface de linha de comando
  index.ts        API pública
  utils.ts        Funções utilitárias compartilhadas
  errors.ts       Classes de erro estruturadas
  keywords.ts     Metadados das palavras-chave
types/
  index.ts        Definições TypeScript
test/
  tokenizer.test.ts
  parser.test.ts
  interpreter.test.ts
```

## Fluxo de trabalho

1. Crie uma branch a partir de `main`
2. Implemente sua alteração
3. Execute `npm run build && npm run lint && npm run test`
4. Envie um Pull Request

## Convenções

- **Commits**: Mensagens em português, descritivas e curtas
- **Código**: Seguir o estilo existente (TypeScript, sem comentários extras)
- **Testes**: Adicionar testes para novas funcionalidades
- **Erros**: Usar o formato `Linha X: mensagem|||dica|||exemplo`

## Reportando bugs

Ao reportar um bug, inclua:
1. Código Algori que reproduz o problema
2. Mensagem de erro completa
3. Versão do Algori
4. Sistema operacional

## Licença

Ao contribuir, você concorda que suas alterações serão licenciadas sob a GPL-3.0-or-later.
