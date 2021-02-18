const core = require("@babel/core");
const path = require("path")

/**
 * 
 * @param {String} source 
 * @param {*} inputSource 上一个loader的sourceMap
 * @param {*} data loader.pitch的loader的额外参数
 */
function loader(source, inputSourceMap, data) {
    // console.log(this.resourcePath);
    const options = {
        presets: ["@babel/preset-env"],
        inputSourceMap,
        sourceMap: true,
        filename: path.basename(this.resourcePath)
    }
    const { code, map, ast } = core.transform(source, options);
    return this.callback(null, code, map, ast);
}
// 最左边loader需要返回js，其他loader可以返回任意内容

loader.pitch = function () { }

module.exports = loader;