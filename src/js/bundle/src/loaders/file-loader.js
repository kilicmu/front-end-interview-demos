const path = require('path');
const { getOptions, interpolateName } = require('loader-utils');

/**
 * 拷贝文件
 * @param {*} source 
 * @param {*} inputSourceMap 
 * @param {*} data 
 */
function loader(content, inputSourceMap, data) {

    const options = getOptions(this) || {}; // 获取options

    let filename = interpolateName(this, options.name, { content });

    this.emitFile(filename, content, inputSourceMap); // 向输出目录写入文件

    return `module.exports='${filename}'`;
}

module.exports = loader;
module.exports.raw = true; // 告诉webpack接受二进制