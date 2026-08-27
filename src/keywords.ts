export interface KeywordInfo {
  label: string;
  description: string;
  category: string;
  example?: string;
}

export const KEYWORD_DESCRIPTIONS: Record<string, KeywordInfo> = {
  // Estrutura do programa
  algori: {
    label: "algori",
    description: "Marca o início do programa Algori",
    category: "Estrutura",
    example: "algori programa inicio ... fim",
  },
  programa: {
    label: "programa",
    description: "Nome do programa (opcional)",
    category: "Estrutura",
    example: "programa MeuPrograma",
  },
  inicio: {
    label: "inicio",
    description: "Marca o início do bloco principal do programa",
    category: "Estrutura",
    example: "inicio\n  # código aqui\nfim",
  },
  fim: {
    label: "fim",
    description: "Marca o fim do bloco principal do programa",
    category: "Estrutura",
    example: "inicio\n  ...\nfim",
  },

  // Tipos de dados
  inteiro: {
    label: "inteiro",
    description: "Tipo de dado para números inteiros",
    category: "Tipo",
    example: "inteiro idade = 25",
  },
  real: {
    label: "real",
    description: "Tipo de dado para números decimais (precisão simples)",
    category: "Tipo",
    example: "real pi = 3.14",
  },
  decimal: {
    label: "decimal",
    description: "Tipo de dado para números decimais (precisão dupla)",
    category: "Tipo",
    example: "decimal salario = 2500.50",
  },
  caractere: {
    label: "caractere",
    description: "Tipo de dado para um único caractere",
    category: "Tipo",
    example: "caractere letra = 'A'",
  },
  texto: {
    label: "texto",
    description: "Tipo de dado para texto (strings)",
    category: "Tipo",
    example: "texto nome = \"João\"",
  },
  logico: {
    label: "logico",
    description: "Tipo de dado para valores verdadeiro/falso",
    category: "Tipo",
    example: "logico ativo = verdadeiro",
  },
  vetor: {
    label: "vetor",
    description: "Declara um vetor (array unidimensional)",
    category: "Tipo",
    example: "inteiro vetor numeros[10]",
  },
  matriz: {
    label: "matriz",
    description: "Declara uma matriz (array bidimensional)",
    category: "Tipo",
    example: "real matriz tabela[3][3]",
  },
  constante: {
    label: "constante",
    description: "Declara uma constante (valor não pode ser alterado)",
    category: "Tipo",
    example: "constante real PI = 3.14159",
  },
  vazio: {
    label: "vazio",
    description: "Tipo de retorno vazio (void) para funções sem retorno",
    category: "Tipo",
    example: "funcao vazio mostrarMensagem() { ... }",
  },

  // Estruturas condicionais
  se: {
    label: "se",
    description: "Inicia uma estrutura condicional",
    category: "Condicional",
    example: "se (idade >= 18) entao ... fimSe",
  },
  entao: {
    label: "entao",
    description: "Bloco executado quando a condição for verdadeira",
    category: "Condicional",
    example: "se (x > 0) entao\n  escreva(\"Positivo\")",
  },
  senao: {
    label: "senao",
    description: "Bloco executado quando a condição for falsa",
    category: "Condicional",
    example: "se (x > 0) entao\n  ...\nsenao\n  ...",
  },
  fimse: {
    label: "fimSe",
    description: "Marca o fim da estrutura condicional",
    category: "Condicional",
    example: "se (condicao) entao\n  ...\nfimSe",
  },

  // Estruturas de repetição
  enquanto: {
    label: "enquanto",
    description: "Laço de repetição com condição no início",
    category: "Repetição",
    example: "enquanto (i < 10) faca\n  i = i + 1\nfimEnquanto",
  },
  faca: {
    label: "faca",
    description: "Bloco do laço enquanto (executa pelo menos uma vez)",
    category: "Repetição",
    example: "enquanto (condicao) faca\n  ...\nfimEnquanto",
  },
  fimenquanto: {
    label: "fimEnquanto",
    description: "Marca o fim do laço enquanto",
    category: "Repetição",
    example: "enquanto (condicao) faca\n  ...\nfimEnquanto",
  },
  para: {
    label: "para",
    description: "Laço de repetição com contador definido",
    category: "Repetição",
    example: "para (inteiro i = 0; i < 10; i = i + 1) faca\n  ...\nfimPara",
  },
  de: {
    label: "de",
    description: "Valor inicial do laço para",
    category: "Repetição",
    example: "para (inteiro i = 1 de 10) faca\n  ...\nfimPara",
  },
  ate: {
    label: "ate",
    description: "Valor final do laço para",
    category: "Repetição",
    example: "para (inteiro i = 1 ate 10) faca\n  ...\nfimPara",
  },
  passo: {
    label: "passo",
    description: "Incremento do laço para (opcional, padrão 1)",
    category: "Repetição",
    example: "para (inteiro i = 0 ate 10 passo 2) faca\n  ...\nfimPara",
  },
  fimpara: {
    label: "fimPara",
    description: "Marca o fim do laço para",
    category: "Repetição",
    example: "para (...) faca\n  ...\nfimPara",
  },

  // Entrada e Saída
  escreva: {
    label: "escreva",
    description: "Imprime texto na saída (sem quebra de linha)",
    category: "Entrada/Saída",
    example: "escreva(\"Olá \")",
  },
  escrevaln: {
    label: "escrevaln",
    description: "Imprime texto na saída com quebra de linha",
    category: "Entrada/Saída",
    example: "escrevaln(\"Olá Mundo\")",
  },
  leia: {
    label: "leia",
    description: "Lê um valor digitado pelo usuário",
    category: "Entrada/Saída",
    example: "texto nome = leia(\"Digite seu nome: \")",
  },
  mostrar: {
    label: "mostrar",
    description: "Exibe uma mensagem (sinônimo de escreva)",
    category: "Entrada/Saída",
    example: "mostrar(\"Resultado: \", x)",
  },
  capturar: {
    label: "capturar",
    description: "Lê uma entrada do usuário (sinônimo de leia)",
    category: "Entrada/Saída",
    example: "inteiro idade = capturar(\"Sua idade: \")",
  },
  ler: {
    label: "ler",
    description: "Lê dados do usuário (sinônimo de leia)",
    category: "Entrada/Saída",
    example: "texto resposta = leia()",
  },

  // Funções
  funcao: {
    label: "funcao",
    description: "Declara uma função com tipo de retorno",
    category: "Função",
    example: "funcao real somar(real a, real b) {\n  retorne a + b\n}",
  },
  retorne: {
    label: "retorne",
    description: "Retorna um valor de uma função",
    category: "Função",
    example: "retorne a + b",
  },

  // Valores lógicos
  verdadeiro: {
    label: "verdadeiro",
    description: "Valor lógico verdadeiro (true)",
    category: "Lógico",
    example: "logico ativo = verdadeiro",
  },
  falso: {
    label: "falso",
    description: "Valor lógico falso (false)",
    category: "Lógico",
    example: "logico inativo = falso",
  },

  // Operadores lógicos
  e: {
    label: "e",
    description: "Operador lógico E (AND)",
    category: "Lógico",
    example: "se (a > 0 e b > 0) entao ...",
  },
  ou: {
    label: "ou",
    description: "Operador lógico OU (OR)",
    category: "Lógico",
    example: "se (a > 0 ou b > 0) entao ...",
  },
  nao: {
    label: "nao",
    description: "Operador lógico NÃO (NOT)",
    category: "Lógico",
    example: "se (nao ativo) entao ...",
  },

  // Operadores aritméticos
  div: {
    label: "div",
    description: "Divisão inteira (resultado sem decimal)",
    category: "Aritmético",
    example: "inteiro resultado = 10 div 3  #resultado: 3",
  },
  mod: {
    label: "mod",
    description: "Resto da divisão (módulo)",
    category: "Aritmético",
    example: "inteiro resto = 10 mod 3  #resultado: 1",
  },
};

export function getKeywordInfo(word: string): KeywordInfo | undefined {
  return KEYWORD_DESCRIPTIONS[word.toLowerCase()];
}
