# Guia do Professor - Algori

Este guia ajuda professores a configurar e usar o Algori em sala de aula.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Requisitos do Sistema](#requisitos-do-sistema)
3. [Instalação em Laboratório](#instalação-em-laboratório)
4. [Configuração da Disciplina](#configuração-da-disciplina)
5. [Plano de Aula Sugerido](#plano-de-aula-sugerido)
6. [Exercícios Prontos](#exercícios-prontos)
7. [Solução de Problemas](#solução-de-problemas)

---

## Visão Geral

**Algori** é uma linguagem de pseudocódigo com palavras-chave em português, ideal para ensinar lógica de programação e algoritmos.

### Por que usar Algori?

| Vantagem | Descrição |
|----------|-----------|
| **Sintaxe em português** | Alunos entendem o código sem barreira de idioma |
| **Tipagem estática** | Ensina boas práticas desde o início |
| **Execução interativa** | Permite entrada de dados em tempo real |
| **Multiplataforma** | Funciona em Windows, macOS e Linux |
| **Gratuito e open source** | Sem custos para a instituição |

---

## Requisitos do Sistema

### Mínimo

- **Sistema operacional:** Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **Processador:** x64 ou ARM64
- **Memória RAM:** 512 MB
- **Espaço em disco:** 100 MB

### Recomendado

- **Sistema operacional:** Windows 11, macOS 13+, Ubuntu 22.04+
- **Processador:** x64
- **Memória RAM:** 2 GB
- **Espaço em disco:** 500 MB

---

## Instalação em Laboratório

### Windows (máquinas com acesso à internet)

#### Opção 1: WinGet (recomendado para TI)

```cmd
winget install wanfranklin.algori
```

#### Opção 2: Instalador Silencioso (implantação em massa)

```cmd
algori-1.1.0-setup.exe /VERYSILENT /NORESTART /PATH="C:\Algori"
```

#### Opção 3: PowerShell (executar em todas as máquinas)

```powershell
# Script de instalação remota
$computers = @("PC01", "PC02", "PC03", "PC04")
foreach ($pc in $computers) {
    Invoke-Command -ComputerName $pc -ScriptBlock {
        irm https://raw.githubusercontent.com/wanfranklin/algori/main/install.ps1 | iex
    }
}
```

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/wanfranklin/algori/main/install.sh | sh
```

### Laboratório sem internet

1. Baixe o executável em [GitHub Releases](https://github.com/wanfranklin/algori/releases)
2. Copie para um pen drive
3. Execute em cada máquina
4. Adicione ao PATH do sistema

---

## Configuração da Disciplina

### Estrutura de Pastas Sugerida

```
Aluno/
├── algori/
│   ├── aula01/
│   │   ├── ola_mundo.algori
│   │   └──Variaveis.algori
│   ├── aula02/
│   │   ├── condicionais.algori
│   │   └── laços.algori
│   ├── aula03/
│   │   ├── funcoes.algori
│   │   └── vetores.algori
│   └── projetos/
│       ├── calculadora.algori
│       └── jogo.adivinha.algori
```

### Comandos Úteis para Aula

```bash
# Executar programa
algori programa

# Verificar versão
algori --version

# Mostrar ajuda
algori --help

# Atualizar o Algori
algori --update
```

---

## Plano de Aula Sugerido

### Aula 1: Introdução (2 horas)

**Objetivo:** Instalar o Algori e executar o primeiro programa.

| Atividade | Tempo | Descrição |
|-----------|-------|-----------|
| Instalação | 30 min | Instalar o Algori em todas as máquinas |
| Apresentação | 15 min | Explicar o que é pseudocódigo |
| Prática | 45 min | Executar "Olá, Mundo!" |
| Exercício | 30 min | Criar programa com entrada de dados |

**Código da Aula 1:**

```algori
algori "Aula01"

mostrar("Olá, Mundo!")
mostrar("Bem-vindo ao Algori!")

mostrar("Qual é o seu nome?")
texto nome = capturar()
mostrar("Olá, " + nome + "!")
```

### Aula 2: Variáveis e Tipos (2 horas)

**Objetivo:** Entender variáveis e tipos de dados.

| Atividade | Tempo | Descrição |
|-----------|-------|-----------|
| Revisão | 10 min | Revisar aula anterior |
| Teoria | 20 min | Explicar tipos: inteiro, texto, real, logico |
| Prática | 50 min | Exemplos de variáveis |
| Exercício | 40 min | Calculadora simples |

**Código da Aula 2:**

```algori
algori "Aula02"

mostrar("=== Variáveis e Tipos ===")

inteiro idade = 25
texto nome = "João"
real altura = 1.75
logico estudante = verdadeiro

mostrar("Nome: " + nome)
mostrar("Idade: " + idade)
mostrar("Altura: " + altura)
mostrar("Estudante: " + estudante)
```

### Aula 3: Condicionais (2 horas)

**Objetivo:** Usar estruturas condicionais.

| Atividade | Tempo | Descrição |
|-----------|-------|-----------|
| Revisão | 10 min | Revisar aula anterior |
| Teoria | 20 min | Explicar se/senao |
| Prática | 50 min | Exemplos de condicionais |
| Exercício | 40 min | Verificar idade |

**Código da Aula 3:**

```algori
algori "Aula03"

mostrar("=== Condicionais ===")

mostrar("Qual é a sua idade?")
inteiro idade = capturar()

se (idade >= 18) {
    mostrar("Você é maior de idade!")
} senao {
    mostrar("Você é menor de idade!")
}
```

### Aula 4: Laços (2 horas)

**Objetivo:** Usar estruturas de repetição.

| Atividade | Tempo | Descrição |
|-----------|-------|-----------|
| Revisão | 10 min | Revisar aula anterior |
| Teoria | 20 min | Explicar para e enquanto |
| Prática | 50 min | Exemplos de laços |
| Exercício | 40 min | Tabuada |

**Código da Aula 4:**

```algori
algori "Aula04"

mostrar("=== Laços de Repetição ===")

mostrar("Tabuada do 5:")
para (inteiro i = 1; i <= 10; i = i + 1) {
    mostrar("5 x " + i + " = " + (5 * i))
}
```

### Aula 5: Funções (2 horas)

**Objetivo:** Criar e usar funções.

| Atividade | Tempo | Descrição |
|-----------|-------|-----------|
| Revisão | 10 min | Revisar aula anterior |
| Teoria | 20 min | Explicar funções |
| Prática | 50 min | Exemplos de funções |
| Exercício | 40 min | Calculadora com funções |

**Código da Aula 5:**

```algori
algori "Aula05"

mostrar("=== Funções ===")

funcao inteiro soma(inteiro a, inteiro b) {
    retorne a + b
}

funcao inteiro subtrai(inteiro a, inteiro b) {
    retorne a - b
}

inteiro resultado1 = soma(10, 5)
inteiro resultado2 = subtrai(10, 5)

mostrar("10 + 5 = " + resultado1)
mostrar("10 - 5 = " + resultado2)
```

---

## Exercícios Prontos

Todos os exercícios estão na pasta `exemplos/aula/`. Veja a lista completa em [exemplos/aula/README.md](../exemplos/aula/README.md).

### Nível Básico

| Exercício | Arquivo | Conceito |
|-----------|---------|----------|
| Olá Mundo | `01_ola_mundo.algori` | Saída de dados |
| Variáveis | `02_variaveis.algori` | Tipos de dados |
| Entrada | `03_entrada.algori` |capturar() |
| Condicionais | `04_condicionais.algori` | se/senao |
| Laços | `05_lacos.algori` | para/enquanto |

### Nível Intermediário

| Exercício | Arquivo | Conceito |
|-----------|---------|----------|
| Funções | `06_funcoes.algori` | Funções |
| Vetores | `07_vetores.algori` | Arrays |
| Matrizes | `08_matrizes.algori` | Matrizes |
| Strings | `09_strings.algori` | Manipulação de texto |

### Nível Avançado

| Exercício | Arquivo | Conceito |
|-----------|---------|----------|
| Calculadora | `10_calculadora.algori` | Projeto integrador |
| Jogo Adivinha | `11_jogo_adivinha.algori` | Lógica complexa |
| Ordenação | `12_ordenacao.algori` | Algoritmos |

---

## Solução de Problemas

### O comando `algori` não é reconhecido

**Windows:**
1. Feche e abra um novo terminal
2. Verifique se o Algori está no PATH
3. Execute o script de verificação: `.\scripts\check-windows.ps1`

**macOS/Linux:**
1. Execute: `source ~/.bashrc` ou `source ~/.zshrc`
2. Verifique se o Algori está no PATH: `which algori`

### Erro de permissão

**Windows:**
```powershell
# Executar como administrador
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**macOS/Linux:**
```bash
chmod +x /usr/local/bin/algori
```

### Erro de sintaxe

Verifique se está usando as palavras-chave corretas em português:
- `mostrar` (não `print`)
- `capturar` (não `input`)
- `se` (não `if`)
- `senao` (não `else`)
- `enquanto` (não `while`)
- `para` (não `for`)

---

## Recursos Adicionais

- [Documentação da Linguagem](https://wanfranklin.github.io/algori/linguagem/)
- [GitHub do Projeto](https://github.com/wanfranklin/algori)
- [Reportar Problemas](https://github.com/wanfranklin/algori/issues)

---

## Contato

Para dúvidas ou sugestões, abra uma issue no [GitHub](https://github.com/wanfranklin/algori/issues).
