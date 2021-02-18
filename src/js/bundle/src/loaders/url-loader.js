const path = require('path');
const mime = require('mime');
const { getOptions, interpolateName } = require("loader-utils");
function loader(content) {
    const options = getOptions(this) || {};
    const { limit, fallback = "file-loader" } = options;

    const mimeType = mime.getType(this.resoucePath);
    if (content.length < limit) {
        const base64Str = `data:${mimeType};base64,${content.toString('base64')}`;
        return `module.exports = ${JSON.stringify(base64Str)}`;
    } else {
        let fileLoader = require(fallback);
        return fileLoader.call(this, content);
    }

}
loader.raw = true;
module.exports = loader;