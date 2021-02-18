const core = require("@babel/core");
const types = require("babel-types");
// const babelPluginTransformEs2015ArrowFunctions = require("babel-plugin-transform-es2015-arrow-functions")
const babelPluginTransformClass = require("./babel-plugins/babel-plugin-transform-classes");
const fs = require("fs");
const path = require("path")

const sourceCode = fs.readFileSync(path.resolve(__dirname, "./code.js"));




const targetCode = core.transform(sourceCode, {
    plugins: [babelPluginTransformClass]
})

console.log(targetCode.code)


