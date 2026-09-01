# Algori for VSCode

Extensão oficial do VSCode para a linguagem de programação Algori.

## Funcionalidades

- **Syntax Highlighting** - Cores para palavras-chave em português
- **Autocomplete** - Sugestões de código enquanto você digita
- **Snippets** - Atalhos para estruturas comuns
- **Execução Integrada** - Execute seus programas diretamente no VSCode

## Instalação

### Via VSIX (recomendado)

1. Baixe o arquivo `algori-1.1.1.vsix`
2. Abra o VSCode
3. Pressione `Ctrl+Shift+X` para abrir a aba de extensões
4. Clique nos três pontos (`...`) e selecione "Instalar VSIX..."
5. Selecione o arquivo baixado

### Via Marketplace

1. Abra o VSCode
2. Pressione `Ctrl+Shift+X` para abrir a aba de extensões
3. Pesquise por "Algori"
4. Clique em "Instalar"

## Uso

### Criar um arquivo

1. Crie um arquivo com extensão `.algori`
2. O VSCode reconhece automaticamente a linguagem

### Digitar código

A extensão oferece:

- **Cores** para palavras-chave
- **Sugestões** ao digitar
- **Completar** com Tab

Exemplo:

```
mostrar("Olá, Mundo!")
```

### Executar programa

- Pressione `F5`
- Ou clique no botão "Executar" no canto superior direito
- Ou clique com o botão direito e selecione "Algori: Executar Programa"

### Snippets disponíveis

| Digite | Pressione Tab | Resultado |
|--------|---------------|-----------|
| `mostrar` | Tab | `mostrar("texto")` |
| `capturar` | Tab | `tipo variavel = capturar()` |
| `se` | Tab | `se (condicao) { ... } senao { ... }` |
| `para` | Tab | `para (tipo i = 0; i < limite; i = i + 1) { ... }` |
| `funcao` | Tab | `tipo nome(parametros) { ... }` |

## Arquivos de Exemplo

A pasta `exemplos/aula/` contém exercícios prontos para testar.

## Solução de Problemas

### A extensão não aparece

1. Reinicie o VSCode
2. Verifique se a extensão está habilitada na aba de extensões

### Syntax highlighting não funciona

1. Verifique se o arquivo tem extensão `.algori`
2. Clique no canto inferior direito e selecione "Algori"

### Execução não funciona

1. Verifique se o Algori está instalado: `algori --version`
2. Abra o terminal e teste manualmente: `algori arquivo`

## Desenvolvimento

### Estrutura

```
extensions/vscode/
├── package.json          # Configuração da extensão
├── syntaxes/
│   └── algori.tmLanguage.json  # Syntax highlighting
├── snippets/
│   └── algori.json       # Snippets
├── src/
│   └── extension.ts      # Lógica da extensão
└── language-configuration.json  # Configuração de linguagem
```

### Build

```bash
cd extensions/vscode
npm install
npm run compile
```

### Empacotar

```bash
npm install -g @vscode/vsce
vsce package
```

Isso gera o arquivo `algori-1.1.1.vsix` para distribuição.

## Licença

GPL-3.0-or-later

## Contribuindo

Veja [CONTRIBUTING.md](../../CONTRIBUTING.md) para mais informações.
