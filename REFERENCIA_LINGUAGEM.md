# Referência da Linguagem Algori

Referência completa de todas as funcionalidades, funções built-in, tipos e planos de melhoria.

---

## Sumário

- [Tipos](#tipos)
- [Variáveis e Constantes](#variáveis-e-constantes)
- [Operadores](#operadores)
- [Controle de Fluxo](#controle-de-fluxo)
- [Laços](#laços)
- [Funções](#funções)
- [Arrays e Matrizes](#arrays-e-matrizes)
- [Entrada e Saída](#entrada-e-saída)
- [Funções Built-in](#funções-built-in)
- [Linha de Comando (CLI)](#linha-de-comando-cli)
- [Cabecalho do Programa](#cabecalho-do-programa)
- [Planos de Melhoria](#planos-de-melhoria)

---

## Tipos

| Tipo | Descrição | Valor padrão | Exemplo |
|------|-----------|--------------|---------|
| `inteiro` | Número inteiro (32-bit) | `0` | `inteiro x = 42` |
| `real` / `decimal` | Número de ponto flutuante | `0` | `real pi = 3.14` |
| `texto` | String (UTF-8) | `""` | `texto nome = "Algori"` |
| `caractere` | Caractere único | `""` | `caractere c = "A"` |
| `logico` | Booleano | `false` | `logico ativo = verdadeiro` |
| `vetor` | Array unidimensional | `[]` | `inteiro vetor[10]` |
| `matriz` | Array bidimensional | `[]` | `real matriz[3][4]` |
| `vazio` | Sem retorno (funções) | — | `funcao vazio saudar() { ... }` |

### Literais

```
42              # inteiro
3.14            # real
"Olá"           # texto
verdadeiro      # logico (true)
falso           # logico (false)
[1, 2, 3]       # array literal
```

---

## Variáveis e Constantes

### Declaração

```
inteiro x = 5
texto nome = "Algori"
real pi = 3.14
logico ativo = verdadeiro

# Sem inicialização (valor padrão)
inteiro y           # y = 0
texto s             # s = ""
logico flag         # flag = false
```

### Constantes

```
constante PI = 3.14
constante MAX = 100
```

Constantes não podem ser reatribuidas após a declaração. Tentar fazer `PI = 3.0` gera erro de runtime.

### Atribuição

```
x = 10
nome = "Mundo"
```

Atribuição a variável não declarada gera erro: `Variável 'y' não declarada`.

---

## Operadores

### Aritméticos

| Operador | Descrição | Exemplo |
|----------|-----------|---------|
| `+` | Soma / concatenação | `5 + 3` → `8`, `"Olá" + " " + "Mundo"` |
| `-` | Subtração | `10 - 4` → `6` |
| `*` | Multiplicação | `3 * 7` → `21` |
| `/` | Divisão (real) | `10 / 3` → `3.333...` |
| `%` | Módulo (resto) | `10 % 3` → `1` |
| `div` | Divisão inteira | `10 div 3` → `3` |
| `mod` | Módulo (keyword) | `10 mod 3` → `1` |

### Comparação

| Operador | Descrição |
|----------|-----------|
| `==` | Igual |
| `!=` | Diferente |
| `>` | Maior que |
| `<` | Menor que |
| `>=` | Maior ou igual |
| `<=` | Menor ou igual |

### Lógicos

| Operador | Keyword | Descrição |
|----------|---------|-----------|
| `&&` | `e` | E lógico |
| `\|\|` | `ou` | Ou lógico |
| `!` | `nao` | Negação |

### Unário

| Operador | Descrição |
|----------|-----------|
| `-` | Negação numérica |
| `!` / `nao` | Negação lógica |

### Precedência (maior para menor)

1. `!`, `-` (unário)
2. `*`, `/`, `%`, `div`, `mod`
3. `+`, `-`
4. `<`, `>`, `<=`, `>=`
5. `==`, `!=`
6. `&&`, `e`
7. `||`, `ou`

---

## Controle de Fluxo

### `se` / `senao`

```
se (x > 0) {
  mostrar("positivo")
} senao {
  mostrar("negativo ou zero")
}
```

### `se` / `senao se` (encadeado)

```
se (nota >= 9) {
  mostrar("A")
} senao se (nota >= 7) {
  mostrar("B")
} senao se (nota >= 5) {
  mostrar("C")
} senao {
  mostrar("Reprovado")
}
```

### `pare` (break)

Interrompe o loop mais interno:

```
enquanto (verdadeiro) {
  x = x + 1
  se (x >= 10) { pare }
}
```

### `continua` (continue)

Pula para a próxima iteração do loop:

```
para (inteiro i = 0; i < 10; i = i + 1) {
  se (i % 2 == 0) { continua }
  mostrar(i)  # imprime apenas ímpares
}
```

**Nota:** `pare` e `continua` usados fora de um loop, ou que escapam de uma função via chamada, geram `RuntimeError`.

---

## Laços

### `para` estilo-C

```
para (inteiro i = 0; i < 10; i = i + 1) {
  mostrar(i)
}
```

- Inicialização: `inteiro i = 0` ou `i = 0`
- Condição: qualquer expressão booleana
- Atualização: `i = i + 1`, `i = i - 1`, etc.
- O incremento é executado **antes** de `continua` (correto)

### `para` legado

```
para i de 1 ate 10 {
  mostrar(i)
}

# Com passo
para i de 10 ate 1 passo -1 {
  mostrar(i)
}
```

- `de`: valor inicial
- `ate`: valor final (inclusivo)
- `passo`: incremento (opcional, padrão 1 ou -1 dependendo da direção)

### `enquanto`

```
inteiro x = 0
enquanto (x < 10) {
  mostrar(x)
  x = x + 1
}
```

### Limites de iteração

Todos os laços têm limite de **10.000** iterações. Exceder esse limite gera erro:
```
RuntimeError: Limite de 10000 iterações excedido no 'para'
```

---

## Funções

### Declaração

```
funcao inteiro dobro(inteiro x) {
  retorne x * 2
}

funcao vazio saudar(texto nome) {
  mostrar("Olá, " + nome + "!")
}

funcao inteiro soma(inteiro a, inteiro b) {
  retorne a + b
}
```

### Chamada

```
mostrar(dobro(5))         # 10
saudar("Mundo")           # Olá, Mundo!
inteiro r = soma(3, 4)    # r = 7
```

### Escopo

- Variáveis declaradas dentro da função são **locais** (não vazam para o escopo global)
- Parâmetros são restaurados ao valor anterior após a chamada
- Funções podem mutar variáveis globais (e.g., `contador = contador + 1`)

### Recursão

```
funcao inteiro fatorial(inteiro n) {
  se (n <= 1) { retorne 1 }
  retorne n * fatorial(n - 1)
}
```

Limite de **50** chamadas recursivas. Exceder gera erro de pilha.

### `retorne`

```
retorne 42           # retorna valor
retorne              # retorna null (em funções vazio)
```

---

## Arrays e Matrizes

### Declaração 1D

```
inteiro vetor[10]            # array de 10 inteiros, todos 0
real valores[5]              # array de 5 reais, todos 0
texto nomes[3]               # array de 3 strings, todas ""
```

### Inicialização inline

```
inteiro numeros = [1, 2, 3, 4, 5]
texto frutas = ["maçã", "banana", "laranja"]
```

### Acesso e escrita

```
vetor[0] = 42
mostrar(vetor[0])    # 42
mostrar(vetor[5])    # IndexError se fora dos limites
```

### Matrizes 2D

```
real matriz[3][4]            # matriz 3x4, todos 0.0

# Escrita
matriz[1][2] = 42.5

# Leitura
mostrar(matriz[1][2])        # 42.5

# Bounds check em cada dimensão
matriz[5][0] = 1             # IndexError: índice 5 fora dos limites (tamanho: 3)
matriz[0][10] = 1            # IndexError: índice 10 fora dos limites (tamanho: 4)
```

### Loop com arrays

```
inteiro v[5]
para (inteiro i = 0; i < 5; i = i + 1) {
  v[i] = i * 10
}
mostrar(v[2])    # 20
```

### Matriz com loops

```
real m[3][3]
para (inteiro i = 0; i < 3; i = i + 1) {
  para (inteiro j = 0; j < 3; j = j + 1) {
    m[i][j] = i * 3 + j
  }
}
mostrar(m[2][1])    # 7
```

---

## Entrada e Saída

### `mostrar(...)`

Imprime valores na saída padrão:

```
mostrar("Olá")
mostrar(42)
mostrar(1, 2, 3)          # "123" (concatenados)
mostrar("Nota: ", nota)
```

### `escreva(...)` / `escrevaln(...)`

```
escreva("Digite: ")       # sem quebra de linha
escrevaln("Fim")          # com quebra de linha
```

### `capturar(...)` / `ler(...)`

Solicita entrada do usuário:

```
inteiro idade
capturar(idade)

texto nome
capturar(nome)
```

Em modo interativo, exibe prompt `> ` e aguarda entrada.

---

## Funções Built-in

### Matemática

| Função | Descrição | Exemplo | Resultado |
|--------|-----------|---------|-----------|
| `raiz(x)` | Raiz quadrada | `raiz(9)` | `3` |
| `potencia(base, exp)` | Potência | `potencia(2, 10)` | `1024` |
| `modulo(a, b)` | Resto da divisão | `modulo(10, 3)` | `1` |
| `abs(x)` | Valor absoluto | `abs(-5)` | `5` |
| `arredondar(x)` | Arredondamento | `arredondar(3.7)` | `4` |

### Texto

| Função | Descrição | Exemplo | Resultado |
|--------|-----------|---------|-----------|
| `tamanho(texto)` | Comprimento da string | `tamanho("Olá")` | `3` |
| `subtexto(texto, inicio, fim)` | Substring (indexado em 0) | `subtexto("Olá", 0, 2)` | `"Ol"` |
| `maiusculo(texto)` | Converter para maiúsculas | `maiusculo("olá")` | `"OLÁ"` |
| `minusculo(texto)` | Converter para minúsculas | `minusculo("OLÁ")` | `"olá"` |
| `posicao(texto, busca)` | Índice da primeira ocorrência | `posicao("Olá Mundo", "Mundo")` | `4` |

### Tipo

| Função | Descrição | Exemplo | Resultado |
|--------|-----------|---------|-----------|
| `tipo(valor)` | Retorna o tipo como string | `tipo(42)` | `"inteiro"` |
| `tipo(valor)` | | `tipo("oi")` | `"texto"` |
| `tipo(valor)` | | `tipo(verdadeiro)` | `"logico"` |
| `tipo(valor)` | | `tipo([1,2])` | `"vetor"` |

### Arrays

| Função | Descrição | Exemplo | Resultado |
|--------|-----------|---------|-----------|
| `tamanho_vetor(vetor)` | Número de elementos | `tamanho_vetor([1,2,3])` | `3` |

---

## Linha de Comando (CLI)

O Algori oferece subcomandos em português (e equivalents em inglês):

### Subcomandos

| Comando | Atalho inglês | Descrição |
|---------|---------------|-----------|
| `algori executar <arquivo>` | `algori run <arquivo>` | Executa um programa `.algori` |
| `algori novo [nome]` | `algori new [nome]` | Cria um novo programa com estrutura básica |
| `algori ajuda` | `algori help` | Mostra a ajuda completa |
| `algori versao` | `algori version` | Mostra a versão instalada |
| `algori atualizar` | `algori update` | Verifica e instala atualização |

### Exemplos de uso

```bash
# Executar um programa
algori executar meu_programa.algori

# Criar um novo programa (cria pasta + arquivo .algori)
algori novo ola_mundo

# Ver versão
algori versao

# Atualizar
algori atualizar
```

### Compatibilidade legado

O formato antigo ainda funciona:

```bash
algori meu_programa.algori    # funciona como "algori executar"
algori --help                 # funciona como "algori ajuda"
algori --version              # funciona como "algori versao"
```

---

## Cabecalho do Programa

### Estilo moderno

```
algori "MeuPrograma"
{
  mostrar("Olá!")
}
```

### Estilo legado

```
programa MeuPrograma
  mostrar("Olá!")
fim
```

### Sem cabecalho

```
mostrar("Olá!")
```

O Algori aceita código sem cabecalho para scripts simples.

---

## Tratamento de Erros

Erros de parse e runtime incluem:
- **Linha do erro**: número da linha onde ocorreu
- **Mensagem**: descrição do erro em português
- **Dica** (opcional): sugestão de como corrigir
- **Exemplo** (opcional): código de exemplo

Exemplo de saída de erro:
```
Linha 5: Divisão por zero
  Dica: Verifique se o divisor é diferente de zero.
  Exemplo:
    se (divisor != 0) entao
      resultado = numerador / divisor
    fimSe
```

---

## Planos de Melhoria

### Curto prazo

| Item | Descrição | Prioridade |
|------|-----------|------------|
| Validação de argumentos built-in | `raiz()`, `potencia()`, `modulo()` devem validar tipo e quantidade de argumentos | Alta |
| `passo 0` no `para` | Gerar erro claro em vez de loop infinito | Alta |
| Escopo completo por frame | Implementar pilha de escopos em vez de snapshot de variáveis | Média |
| Dead code cleanup | Remover `parseExpressionToString` e outros métodos não usados | Baixa |

### Médio prazo

| Item | Descrição | Prioridade |
|------|-----------|------------|
| Arrays 3D+ | Suporte a matrizes com mais de 2 dimensões | Média |
| Strings mutáveis | `texto` como array de caracteres editável | Média |
| `escolha`/`caso` (switch) | Estrutura de seleção multi-branch | Média |
| `para-cada` (for-each) | Iteração sobre arrays: `para-cada item de vetor { ... }` | Média |
| Break/Continue com label | `pare "loopExterno"` para sair de loops aninhados | Baixa |
| Validação de tipos em runtime | Erro claro para operações entre tipos incompatíveis | Média |

### Longo prazo

| Item | Descrição | Prioridade |
|------|-----------|------------|
| Imports/Módulos | `inclua "biblioteca.algori"` para reutilizar código | Alta |
| Structs/Registros | `registro Pessoa { texto nome, inteiro idade }` | Alta |
| Orientação a objetos | `classe Animal { ... }` com herança | Média |
| Tratamento de erros | `tente { ... } pegue erro { ... }` | Média |
| Async/Await | Suporte a operações assíncronas (I/O, rede) | Baixa |
| Compilador para bytecode | Melhor performance para programas grandes | Baixa |
| REPL interativo | Modo interativo para testar expressões | Média |
| Depurador integrado | Breakpoints, step-by-step, inspeção de variáveis | Alta |

### Infraestrutura

| Item | Descrição | Prioridade |
|------|-----------|------------|
| Testes de integração end-to-end | Testar CLI completa com arquivos .algori | Alta |
| CI/CD completo | Build + testes + release automatizada | Alta |
| Documentação da API | Gerar docs a partir de JSDoc/TSDoc | Média |
| Benchmarking | Medir performance do interpretador | Baixa |
| Web playground | Versão rodando no navegador via WebAssembly | Média |
