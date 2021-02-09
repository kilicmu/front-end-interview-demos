const babelCore = require("@babel/core");
const presetEnv = require("@babel/preset-env");

/*
    工作原理：
    1. babel core -> 将es6转换为es6 ast
    2. babel-preset-env -> 将es6 ast转换为es5的ast
    3. babel core -> 将es5语法树 -> es5代码
*/
function loader (source) {
    const es5 = babelCore.transform(source, {
        presets: ["@babel/preset-env"]
    });
    return es5
}

module.exports = loader;