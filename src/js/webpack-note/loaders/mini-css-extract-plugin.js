
const csses = []
function loader(cssSource) {
    csses.push(cssSource);
}

class MiniCssExtractPlugin {
    apply() {
        const allCss = csses.join('\n');
        this.emitFile('main.css', allCss);
    }
}
MiniCssExtractPlugin.loader = loader; // loader本质是一个样式收集器

module.exports = MiniCssExtractPlugin;