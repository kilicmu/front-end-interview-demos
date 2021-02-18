const esprima = require("esprima");
const estraverse = require("estraverse");
const escodegen = require("escodegen");
const fs = require('fs');
const { resolve } = require("path")
const sourceCode = fs.readFileSync(resolve(__dirname, './code.js'), { encoding: 'utf8' })


const ast = esprima.parse(sourceCode);
console.log(ast);
// 节点深度优先遍历(仅仅便利有type的节点)
let indent = 0;
const padding = () => " ".repeat(indent);
estraverse.traverse(ast, {
    enter: function (node) {
        console.log(padding() + '=> ' + node.type);
        indent += 2;
    },
    leave: function (node) {
        console.log(padding() + '<= ' + node.type);
        indent -= 2;
    }
})