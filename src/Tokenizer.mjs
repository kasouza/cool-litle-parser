export const TokenType = Object.freeze({
  NUMBER: "NUMBER",
  STRING: "STRING",
  SEMICOLON: "SEMICOLON",
  OPERATOR: "OPERATOR"
});

const tokenizerSpec = [
  [/^\/\/.*/, null], // This type of comments
  [/^\/\*[\s\S]*\*\//, null], /* This type of comments */
  [/^\s+/, null],
  [/^\d+/, TokenType.NUMBER],
  [/^((?:"[^"]*")|(?:'[^']*'))/, TokenType.STRING],
  [/^;/, TokenType.SEMICOLON],
  [/^[\+\*\-\/]/, TokenType.OPERATOR],
];

export class Tokenizer {
  constructor(string) {
    this.string = string;
    this.cursor = 0;
  }

  isEOF() {
    return this.cursor >= this.string.length;
  }

  hasMoreTokens() {
    return this.cursor < this.string.length;
  }

  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this.string.slice(this.cursor);

    for (const [regex, tokenType] of tokenizerSpec) {
      const match = regex.exec(string);
      if (match) {
        this.cursor += match[0].length;

        if (tokenType === null) {
          return this.getNextToken();
        }

        return {
          type: tokenType,
          value: match[0],
        }
      }
    }

    throw new SyntaxError(`Unexpected token near ${string}`);

    // Number literal
    //if (!Number.isNaN(Number(this.string[this.cursor]))) {
      //let number = "";

      //while (!Number.isNaN(Number(this.string[this.cursor]))) {
        //number += this.string[this.cursor];
        //this.cursor++;
      //}

      //return {
        //type: TokenType.NUMBER,
        //value: number
      //};
    //}

    //// String literal
    //const validStringDelimiters = [ "\"", "'" ];
    //const stringDelimiter = validStringDelimiters.find(delim => delim === this.string[this.cursor]);

    //if (stringDelimiter) {
      //let stringLiteral = "";

      //do {
        //stringLiteral += this.string[this.cursor];
        //this.cursor++;
      //} while (this.string[this.cursor] !== stringDelimiter && !this.isEOF());

      //stringLiteral += this.string[this.cursor];
      //this.cursor++;

      //return {
        //type: TokenType.STRING,
        //value: stringLiteral
      //};
    //}

    return null;
  }

}
