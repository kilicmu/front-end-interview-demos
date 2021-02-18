const Compiler = require("./Compiler")


module.exports = function webpack(config) {
    const argv = process.argv.splice(2);
    config = argv.reduce((config, next) => {
        // console.log(config, next);
        if (!next) return config;
        const [key, value] = next.split('=');
        return { ...config, [key]: value }

    }, config);
    // 1. 初始化 compiler
    const compiler = new Compiler(config);
    // 2. 挂载插件 
    const plugins = config?.plugins ?? [];
    if (!Array.isArray(plugins)) throw new TypeError("Config Error: Plugins must be a array");
    for (const plugin of plugins) {
        plugin.apply(compiler);
    }

    return compiler;

}