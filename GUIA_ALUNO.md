# Guia do Aluno - Algori

Bem-vindo ao Algori! Este guia vai te ajudar a começar a programar.

---

## Sumário

1. [O que é Algori?](#o-que-é-algori)
2. [Instalação Rápida](#instalação-rápida)
3. [Seu Primeiro Programa](#seu-primeiro-programa)
4. [Comandos Básicos](#comandos-básicos)
5. [Dicas para Programar](#dicas-para-programar)
6. [Perguntas Frequentes](#perguntas-frequentes)

---

## O que é Algori?

**Algori** é uma linguagem de programação com palavras em português. Em vez de escrever `print`, você escreve `mostrar`. Em vez de `if`, você escreve `se`.

### Exemplo

```algori
mostrar("Olá, Mundo!")
```

Isso vai mostrar na tela: `Olá, Mundo!`

---

## Instalação Rápida

### Windows

Abra o **PowerShell** e digite:

```powershell
irm https://raw.githubusercontent.com/wanfranklin/algori/main/install.ps1 | iex
```

### macOS / Linux

Abra o **Terminal** e digite:

```bash
curl -fsSL https://raw.githubusercontent.com/wanfranklin/algori/main/install.sh | sh
```

### Verificar se funcionou

```bash
algori --version
```

Se mostrar a versão, está tudo certo!

### Atualizar o Algori

```bash
algori --update
```

---

## Seu Primeiro Programa

### Passo 1: Criar o arquivo

Abra o **VSCode** ou o **Bloco de Notas** e digite:

```algori
mostrar("Olá, Mundo!")
mostrar("Eu estou aprendendo a programar!")
```

### Passo 2: Salvar o arquivo

Salve como `ola.algori` na sua pasta de documentos.

### Passo 3: Executar

Abra o terminal e digite:

```bash
algori ola
```

Pronto! Você programou seu primeiro programa!

---

## Comandos Básicos

### Mostrar texto na tela

```algori
mostrar("Olá!")
mostrar("Texto aqui")
```

### Criar variáveis

```algori
inteiro idade = 15
texto nome = "Ana"
real nota = 8.5
logico aprovado = verdadeiro
```

### Pedir dados ao usuário

```algori
mostrar("Qual é o seu nome?")
texto nome = capturar()
mostrar("Olá, " + nome + "!")
```

### Usar condicionais

```algori
inteiro nota = 8

se (nota >= 7) {
    mostrar("Aprovado!")
} senao {
    mostrar("Reprovado!")
}
```

### Usar laços

```algori
para (inteiro i = 1; i <= 5; i = i + 1) {
    mostrar("Contagem: " + i)
}
```

### Criar funções

```algori
funcao inteiro soma(inteiro a, inteiro b) {
    retorne a + b
}

inteiro resultado = soma(10, 5)
mostrar("Soma: " + resultado)
```

---

## Dicas para Programar

### 1. Comece simples

Comece com programas que mostram texto na tela. Depois vá complicando.

### 2. Use palavras-chave em português

| Em vez de | Use |
|-----------|-----|
| `print` | `mostrar` |
| `input` | `capturar` |
| `if` | `se` |
| `else` | `senao` |
| `while` | `enquanto` |
| `for` | `para` |
| `function` | `funcao` |
| `return` | `retorne` |
| `true` | `verdadeiro` |
| `false` | `falso` |

### 3. Guarde seus arquivos

Crie uma pasta `algori` na sua área de trabalho e guarde todos os seus programas lá.

### 4. Teste sempre

Execute seu programa frequentlyente para ver se está funcionando.

### 5. Leia os erros

Se aparecer uma mensagem de erro, leia com atenção. Ela diz onde está o problema.

---

## Perguntas Frequentes

### O comando `algori` não funciona

**Solução:** Feche e abra um novo terminal. Se ainda não funcionar, execute o script de verificação:

```powershell
# Windows
irm https://raw.githubusercontent.com/wanfranklin/algori/main/scripts/check-windows.ps1 | iex
```

### Aparece erro de sintaxe

**Solução:** Verifique se está usando palavras-chave em português e se os parênteses e chaves estão corretos.

### Como faço para voltar ao início do programa?

**Solução:** Não tem como voltar automaticamente. Execute o programa novamente.

### Posso usar acentos?

**Solução:** Sim! Você pode usar acentos nos textos:

```algori
mostrar("Olá, como vai?")
```

### Como faço para comentar o código?

**Solução:** Use `//` para comentários de uma linha:

```algori
// Este é um comentário
mostrar("Isto vai aparecer")
// Isto não vai aparecer
```

---

## Recursos

- [Documentação da Linguagem](https://wanfranklin.github.io/algori/linguagem/)
- [Exercícios Prontos](exemplos/aula/)
- [Guia do Professor](GUIA_PROFESSOR.md)

---

## Precisa de Ajuda?

Pergunte ao seu professor ou abra uma issue no [GitHub](https://github.com/wanfranklin/algori/issues).

Bons estudos! 🚀
