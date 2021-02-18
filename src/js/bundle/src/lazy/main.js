(() => {
    var modules = {};
    var cache = {};
    function require(moduleId) {
        if (cache[moduleId]) {
            return cache[moduleId];
        }

        var module = { export: {} };
        cache[moduleId] = module;
        modules[moduleId].call(module.exports, module, module.exports, require);
        return module.exports;
    }

    require.f = {};

    require.p = '/';

    require.u = (chunkId) => {
        return chunkId + 'main.js'
    }

    require.e = function (chunkId) {
        const promises = [];
        require.f.j(chunkId, promises)

    }

    require.l = function (url) {
        let script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    }

    let installedChunks = {
        main: 0,
        // chunk: [resolve, reject]
    }

    require.f.j = function (chunkId, promises) {
        let promise = new Promise((resolve, reject) => {
            installedChunks[chunkId] = [resolve, reject];
        })
        promises.push(promise);
        var url = require.p + require.u(chunkId);
        require.l(url);
    }

    var webpackJsonpCallback = function ([chunksIds, moreModules]) {
        var resolves = chunksIds.map(chunkId => installedChunks[chunkId][0]);
        for (const moduleId in moreModules) {
            modules[moduleId] = moreModules[moduleId];
        }
        resolves.forEach((resolve) => resolve())
    }

    var chunkLoadingGlobal = window['webpack5'] = [];
    chunkLoadingGlobal.push = webpackJsonpCallback;

    require.e("hello").then(require.bind(require, './src/hello.js')).then(result => {
        console.log(result)
    })
})()