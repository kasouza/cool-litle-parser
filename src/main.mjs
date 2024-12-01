import { ASTNodeType, Parser } from "./Parser.mjs";

const parser = new Parser(`
  123 * 32 + 64 * 55;
`);
const ast = parser.parse();
let str = "";

const traverse = (node) => {
  if (!node) {
    return
  }

  if (node.type === ASTNodeType.BinaryExpression) {
    str += "(";
    traverse(node.left);

    str += node.operator;

    traverse(node.right);

    str += ")";
  } else if (node.type === ASTNodeType.NumericLiteral) {
    str += node.value;
  } else if (node.body) {
    if (Array.isArray(node.body)) {
      traverse(node.body[0]);
    } else {
      traverse(node.body);
    }
  }
}

traverse(ast);
console.log(str);
console.log(JSON.stringify(ast, null, 2));

