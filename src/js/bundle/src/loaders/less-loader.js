// yarn add less postcss css-selector-tokenizer -D
const less = require('less');
function loader(content) {
    const cb = this.async(); // 将loader转换为异步，调用cb解除阻塞
    less.render(content, { filename: this.resource }, (err, output) => {
        cb(err, output.css);
    })
}

module.exports = loader;