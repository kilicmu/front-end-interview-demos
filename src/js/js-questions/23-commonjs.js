const fs = require('fs');
const path = require("path");
const vm = require('vm')

const wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
];

function Module(id) {
    this.id = id;
    this.exports = {};
}

Module.prototype.load = function(filename) {
        const extname = path.extname(filename);
        Module._extensions[extname](this);
}

Module._load = function(filepath) {
    const filename = Module._resolveFilename(filepath);
    if(Module.cache[filename]) {
        return Module.cache[filename].exports;
    }
    const module = new Module(filename);
    Module.cache[filename] = module;
    module.load(filename);
    return module.exports
}

Module._resolveFilename = function(filepath){
    filepath = path.resolve(__dirname, filepath);
    if(fs.existsSync(filepath)) return filepath;
    for(let ext of Object.keys(Module._extensions)) {
        const filename = filepath + ext;
        console.log(filename);
        if(fs.existsSync(filename)){
            return filename;
        }
    }
}

Module.wrap = function(script) {
    return wrapper[0] + script + wrapper[1];
}

Module._extensions = {
    '.js': function(module){
        const content = fs.readFileSync(module.id, 'utf-8');
        const strFn = Module.wrap(content);
        const fn = vm.runInThisContext(strFn);
        const exports = modules.exports;
        const require = rRequire;
        const __filename = module.id;
        const __dirname = path.dirname(module.id);
        fn.call(exports, exports, require, module, __filename, __dirname)
        return 
    },
    '.json': function(module) {
        const content = fs.readFileSync(module.id, 'utf-8');
        console.log(content)
    }
}

Module.cache = {};


module.exports = {
    rRequire: function(filepath) {
    return Module._load(filepath);
}
}