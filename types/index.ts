export type TokenType =
  | "KEYWORD"
  | "IDENTIFIER"
  | "NUMBER"
  | "STRING"
  | "OPERATOR"
  | "PUNCTUATION"
  | "NEWLINE"
  | "EOF";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

export type ASTNode =
  | VarDeclNode
  | AssignNode
  | ArrayAssignNode
  | PrintNode
  | InputNode
  | CallNode
  | IfNode
  | WhileNode
  | ForNode
  | ReturnNode
  | BreakNode
  | ContinueNode
  | FunctionDeclNode
  | ExprNode;

export interface VarDeclNode {
  kind: "var_decl";
  name: string;
  typeName: string | null;
  expr: ExprNode;
  isConstant: boolean;
  dimensions?: ExprNode[];
  line: number;
}

export interface AssignNode {
  kind: "assign";
  name: string;
  expr: ExprNode;
  line: number;
}

export interface ArrayAssignNode {
  kind: "array_assign";
  name: string;
  indices: ExprNode[];
  expr: ExprNode;
  line: number;
}

export interface PrintNode {
  kind: "print";
  args: ExprNode[];
  line: number;
}

export interface InputNode {
  kind: "input";
  args: ExprNode[];
  line: number;
}

export interface CallNode {
  kind: "call";
  callee: string;
  args: ExprNode[];
  line: number;
}

export interface IfBranch {
  condition: ExprNode | null;
  body: ASTNode[];
}

export interface IfNode {
  kind: "if";
  branches: IfBranch[];
  elseBranch: ASTNode[] | null;
  line: number;
}

export interface WhileNode {
  kind: "while";
  condition: ExprNode;
  body: ASTNode[];
  line: number;
}

export interface ForNode {
  kind: "for";
  varName: string;
  start: ExprNode;
  end: ExprNode;
  step: ExprNode | null;
  condition: ExprNode | null;
  update: AssignNode | null;
  body: ASTNode[];
  line: number;
}

export interface ReturnNode {
  kind: "return";
  expr: ExprNode | null;
  line: number;
}

export interface BreakNode {
  kind: "break";
  line: number;
}

export interface ContinueNode {
  kind: "continue";
  line: number;
}

export interface FunctionParam {
  name: string;
  typeName: string | null;
}

export interface FunctionDeclNode {
  kind: "function_decl";
  name: string;
  returnType: string | null;
  params: FunctionParam[];
  body: ASTNode[];
  line: number;
}

export type ExprNode =
  | LiteralNode
  | IdentifierNode
  | BinOpNode
  | UnaryOpNode
  | ArrayNode
  | ArrayAccessNode
  | CallExprNode
  | ConditionalExprNode;

export interface LiteralNode {
  kind: "literal";
  value: number | string | boolean | unknown[];
  line: number;
}

export interface IdentifierNode {
  kind: "identifier";
  name: string;
  line: number;
}

export interface BinOpNode {
  kind: "binop";
  op: string;
  left: ExprNode;
  right: ExprNode;
  line: number;
}

export interface UnaryOpNode {
  kind: "unaryop";
  op: string;
  operand: ExprNode;
  line: number;
}

export interface ArrayNode {
  kind: "array";
  elements: ExprNode[];
  line: number;
}

export interface ArrayAccessNode {
  kind: "array_access";
  name: string;
  indices: ExprNode[];
  line: number;
}

export interface CallExprNode {
  kind: "call_expr";
  callee: string;
  args: ExprNode[];
  line: number;
}

export interface ConditionalExprNode {
  kind: "conditional_expr";
  condition: ExprNode;
  thenBranch: ExprNode;
  elseBranch: ExprNode | null;
  line: number;
}

export interface VariableState {
  name: string;
  value: unknown;
  changedAt: number;
}

export interface ConsoleLine {
  id: number;
  text: string;
  type: "output" | "input" | "input_var" | "error";
  timestamp: string;
}

export interface ExecutionState {
  variables: Record<string, unknown>;
  currentLine: number;
  console: ConsoleLine[];
  status: "idle" | "running" | "paused" | "finished" | "error";
}

export type WorkerMessage =
  | { type: "run"; code: string; breakpoints?: number[] }
  | { type: "step"; code: string; breakpoints?: number[] }
  | { type: "continue"; value?: string }
  | { type: "stop" }
  | { type: "input_response"; value: string };

export type WorkerResponse =
  | { type: "state_update"; state: Partial<ExecutionState> }
  | { type: "input_request"; prompt: string }
  | { type: "finished" }
  | { type: "error"; message: string; line: number };
