
const testLoader = require("./test-loader.js");
module.exports = function render(source, options) {
    let matched = null;
    while (matched = source.match(/(\/\/.*\r?\n?)/)) {
        source = source.replace(matched[1], '\n');
    }
    return source;
}