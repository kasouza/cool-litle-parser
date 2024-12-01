import { Tokenizer, TokenType } from "./Tokenizer.mjs";

const multiplicativeOperators = [
  "*", "/"
];

const additiveOperators = [
  "+", "-"
];

export const ASTNodeType = Object.freeze({
  NumericLiteral: "NumericLiteral",
  StringLiteral: "StringLiteral",
  Program: "Program",
  Expresion: "Expression",
  ExpressionStatement: "ExpressionStatement",
  PrimaryExpression: "PrimaryExpression",
  BinaryExpression: "BinaryExpression"
});

export class Parser {
  /**
   * @var Tokennizer
   */
  #tokenizer;

  #lookahead;

  constructor(string) {
    this.#tokenizer = new Tokenizer(string);
    this.#lookahead = this.#tokenizer.getNextToken();
  }

  parse() {
    return this.Program();
  }

  /**
   * Program
   *  : Statements
   *  ;
   */
  Program() {
    return {
      type: ASTNodeType.Program,
      body: this.Statements()
    };
  }

  /**
   * Statements
   *  : ExpressionStatement
   *  | ExpressionStatement Statements
   *  ;
   */
  Statements() {
    const statements = [];
    statements.push(this.ExpressionStatement());

    while (this.#lookahead !== null) {
      statements.push(this.ExpressionStatement());
    }

    return statements;
  }

  /**
   * ExpressionStatement
   *  : Expression SEMICOLON
   *  ;
   */
  ExpressionStatement() {
    const expression = this.Expression();
    this.#eat(TokenType.SEMICOLON);

    return {
      type: ASTNodeType.ExpressionStatement,
      body: expression,
    }
  }

  /**
   * Expression
   *  : BinaryExpression
   *  ;
   */
  Expression() {
    return this.AdditiveExpression();
  }

  /**
   * BinaryExpression
   *   : MultiplicativeBinaryExpresion
   *   | MultiplicativeBinaryExpresion OPERATOR MultiplicativeBinaryExpresion
   *   ;
   */
  AdditiveExpression() {
    let left = this.MultiplicativeBinaryExpression();

    while (this.#lookahead.type === TokenType.OPERATOR && additiveOperators.includes(this.#lookahead.value)) {
      const op = this.#eat(TokenType.OPERATOR);
      const right = this.MultiplicativeBinaryExpression();

      left = {
        type: ASTNodeType.BinaryExpression,
        operator: op.value,
        left,
        right
      }
    }

    return left;
  }

  /**
   * MultiplicativeBinaryExpression
   *   : PrimaryExpression
   *   | PrimaryExpression OPERATOR BinaryExpression
   *   ;
   */
  MultiplicativeBinaryExpression() {
    let left = this.PrimaryExpression();

    while (this.#lookahead.type === TokenType.OPERATOR && multiplicativeOperators.includes(this.#lookahead.value)) { 
      const op = this.#eat(TokenType.OPERATOR);
      const right = this.PrimaryExpression();

      left = {
        type: ASTNodeType.BinaryExpression,
        operator: op.value,
        left,
        right
      }
    }

    return left;
  }

  /**
   * PrimaryExpression
   *  : Literal
   *  ;
   */
  PrimaryExpression() {
    return this.Literal()
  }

  /**
   * Literal
   *  : NumericLiteral
   *  | StringLiteral
   *  ;
   */
  Literal() {
    switch (this.#lookahead.type) {
      case TokenType.STRING: return this.StringLiteral();
      case TokenType.NUMBER: return this.NumericLiteral();
      default:
        throw new SyntaxError(`Unexpected literal: ${this.#lookahead.type}`);
    }
  }

  /** 
  * StringLiteral
  *  : STRING
  *  ;
  */
  StringLiteral() {
    const token = this.#eat(TokenType.STRING);

    console.log(token);
    return {
      type: ASTNodeType.StringLiteral,
      value: token.value.slice(1, -1)
    };
  }

  /** 
  * NumericLiteral
  *  : NUMBER
  *  ;
  */
  NumericLiteral() {
    const token = this.#eat(TokenType.NUMBER);

    return {
      type: ASTNodeType.NumericLiteral,
      value: Number(token.value)
    };
  }

  /**
   * @param {string} tokenType
   */
  #eat(tokenType) {
    const token = this.#lookahead;

    if (token === null) {
      throw new SyntaxError(`Unexpected end of input, expected: ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(`Unexpected token: ${token.value}, expected: ${tokenType}`);
    }

    this.#lookahead = this.#tokenizer.getNextToken();

    return token;
  }

}
