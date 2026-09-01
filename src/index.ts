/**
 * @module algori-core
 * @description
 * Nucleo da linguagem de programacao Algori em portugues.
 * Fornece os principais componentes para tokenizar, fazer parsing e executar codigo Algori.
 *
 * @example
 * // Executar um programa Algori
 * import { tokenize, parse, Interpreter } from 'algori-core';
 *
 * const code = 'algori "HelloWorld"\\nmostrar("Ola, Mundo!")';
 * const tokens = tokenize(code);
 * const ast = parse(tokens);
 * const interpreter = new Interpreter();
 * interpreter.run(ast);
 * console.log(interpreter.console[0].text); // "Ola, Mundo!"
 */

/**
 * Realiza tokenizacao (analise lexica) de codigo Algori.
 */
export { tokenize } from "./tokenizer.js";

/**
 * Realiza parsing (analise sintatica) de tokens para AST.
 */
export { parse } from "./parser.js";

/**
 * Interpretador que executa a AST.
 */
export { Interpreter, InputRequestError, ReturnSignal, BreakSignal, ContinueSignal } from "./interpreter.js";

/**
 * Informacoes sobre palavras-chave da linguagem.
 */
export { KEYWORD_DESCRIPTIONS, getKeywordInfo } from "./keywords.js";
export type {
  Token,
  TokenType,
  ASTNode,
  ExprNode,
  VarDeclNode,
  AssignNode,
  PrintNode,
  InputNode,
  CallNode,
  IfNode,
  WhileNode,
  ForNode,
  ReturnNode,
  BreakNode,
  ContinueNode,
  FunctionDeclNode,
  FunctionParam,
  ArrayNode,
  ArrayAccessNode,
  CallExprNode,
  ConditionalExprNode,
  LiteralNode,
  IdentifierNode,
  BinOpNode,
  UnaryOpNode,
  IfBranch,
  VariableState,
  ConsoleLine,
  ExecutionState,
  WorkerMessage,
  WorkerResponse,
} from "../types/index.js";
