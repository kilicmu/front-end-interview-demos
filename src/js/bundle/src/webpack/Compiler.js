const SyncHook = require("tapable/lib/SyncHook.js");
const RunPlugin = require("../plugins/RunPlugin");
const types = require("babel-types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const path = require("path");
const fs = require("fs");

const baseDir = transformToUnix(process.cwd());
const baseExtensions = ['', '.js', '.jsx', '.json'];
const extensions = this.options?.resolve?.extensions ?? baseExtensions;

module.exports = class Compiler {
    constructor(options) {
        this.options = options;
        this.hooks = {
            run: new SyncHook([]),
            done: new SyncHook([]),
            emit: new SyncHook([]),
        };
        this.context = this.options?.context ?? process.cwd();
        this.entries = [];
        this.modules = [];
        this.chunks = [];
        this.assets = {};
        this.files = [];
    }

    run(callback) {
        this.hooks.run.call();

        const entry = parseEntry(this.options.entry, this.context);
        Object.keys(entry).forEach((entryName) => {
            const entryPath = entry[entryName];
            if (!fs.existsSync(entryPath)) throw new Error("entry doesn't exist: " + entry)
            // 从入口开始编译
            const entryModule = this.buildModule(entryName, entryPath);
            this.modules.push(entryModule)

            // 生成chunks
            const chunk = { name: entryName, entryModule, modules: this.modules.filter(m => m.name === entryName) };
            this.chunks.push(chunk);
            this.entries.push(chunk);
        })

        this.chunks.forEach(chunk => {
            const filename = path.join(this.options.output.path, this.options.output.filename.replace("[name]", chunk.name));
            this.assets[filename] = getSource(chunk);
        })

        // 写入文件系统
        this.hooks.emit.call();
        const targetPath = path.join(this.options.output.path, this.options.output.filename);
        this.files = Object.keys(this.assets);
        this.files.forEach(file => {
            fs.writeFileSync(file, this.assets[file])
        })

        this.hooks.done.call();
        callback(null, {
            toJson: (config) => {
                return {
                    entries: this.entries,
                    chunks: this.chunks,
                    modules: this.modules,
                    files: this.files,
                    assets: this.assets
                }
            }
        })
    }

    /**
 * 
 * @param {String} entry 
 */
    buildModule(name, modulePath) {
        modulePath = matchingPath(modulePath);
        const sourceCode = fs.readFileSync(modulePath, "utf8");
        const rules = this.options?.module?.rules ?? [];

        let loaders = []
        for (let rule of rules) {
            if (rule.test.test(modulePath)) {
                loaders = [].concat(rule.use);
            }
        }
        for (let i = loaders.length - 1; i >= 0; --i) {
            const loaderOrObject = loaders[i];
            let loader = null;
            if (Object.prototype.toString.call(loaderOrObject) === '[object Object]') {
                loader = require(loaderOrObject?.loader);
            } else {
                loader = loaderOrObject?.loader ?? (source => source)
            }

            const targetCode = loader(sourceCode);

            const moduleId = './' + path.posix.relative(baseDir, modulePath);
            const module = { id: moduleId, dependencies: [], name };


            const ast = parser.parse(targetCode, { sourceType: 'module' });

            traverse.call(this, ast, {
                CallExpression(nodePath) {
                    const { node } = nodePath;
                    if (node.callee.name === "require") {
                        const moduleName = node.arguments[0].value;
                        const dirname = path.posix.dirname(modulePath);
                        const depModulePath = matchingPath(path.posix.join(dirname, moduleName));
                        const depModuleId = './' + path.posix.relative(baseDir, depModulePath);
                        node.arguments = [types.stringLiteral(depModuleId)];
                        module.dependencies.push(depModulePath);
                    }
                }
            });

            let { code } = generator(ast);
            module._source = code;

            module.dependencies.forEach((dependency) => {
                const dependencyModule = this.buildModule(name, dependency);
                this.modules.push(dependencyModule);
            })

            return module;
        }
    }


}


function parseEntry(sourceEntry, ctx) {
    const entry = {};
    if (typeof sourceEntry === 'string') {
        entry['main'] = transformToUnix(path.resolve(ctx, sourceEntry))
    } else {
        Object.keys(sourceEntry).forEach(key => {
            entry[key] = transformToUnix(path.resolve(ctx, sourceEntry[key]))
        })
    }
    return entry;

}

function matchingPath(filePath) {
    const ext = extensions.filter((ext) => {
        return fs.existsSync(filePath + ext);
    })[0];
    if (ext !== '' && !ext) throw new Error('no such file: ' + filePath);
    return filePath + ext;
}


function transformToUnix(filePath) {
    return filePath.replace(/\\/g, path.posix.sep)

}

// const chunk = { name: 'main', entryModule, modules: this.modules };s
function getSource(chunk) {
    return `(() => {
        var modules = {
            ${chunk.modules.map(module => `
                "${module.id}": (module, exports, require) => {
                    ${module._source}
                }`).join(',')}
        }
        

        var cache = {};
        var require = (moduleId) => {
            if(cache[moduleId]) {
                return cache[moduleId].exports;
            }

            var module = (cache[moduleId]) = {
                exports: {}
            };
        
            modules[moduleId](module, module.exports, require);
            return module.exports;
        };

        (()=>{
            ${chunk.entryModule._source};
        })();

    })()`

}