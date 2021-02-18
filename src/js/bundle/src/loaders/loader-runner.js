const { readFile } = require("fs");


const fs = require('fs');
const path = require("path");
const loader = require("./babel-loader");
const readFile = fs.readFile.bind(this);
const PATH_QUERY_FRAGMNET_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/;

// 执行：
// -> pitch  ->  pitch ->  pitch -> |
//                                 read resource
// <- normal <- normal <- normal <- |
// pitch如何有返回值，返回执行上一个normal

/**
 * 
 * @param {String} resource 
 * @returns {{path: string, query: string, fragment: string}} - returns
 */
function parsePathQueryFragment(resource) {
    const result = PATH_QUERY_FRAGMNET_REGEXP.exec(resource);
    return {
        path: result[1],
        query: result[2],
        fragment: result[3]
    }
}

/**
 * 
 * @param {{resource: String, loaders: Array, context: Object, readResource: Function}} options 
 * @param {*} callback
 */
function runLoaders(options, callback) {
    const resource = options.resource || '';
    const loaders = options.loaders || [];
    const loaderContext = options.context || {} // loader runing ctx
    const readResource = options.readResource || readFile;

    const { path: resourcePath, query: resourceQuery, fragment: resourceFragment } = parsePathQueryFragment(resource);

    const contextDirectory = path.dirname(resourcePath);
    loaderContext.context = contextDirectory;
    loaderContext.path = resourcePath;
    loaderContext.query = resourceQuery;
    loaderContext.fragment = resourceFragment;
    loaderContext.index = 0;
    loaderContext.loaders = loaders.map(createLoaderObject);
    loaderContext.callback = null;
    loaderContext.async = null;

    Object.defineProperty(loaderContext, 'resource', {
        get: () => `${loaderContext.resourcePath}${loaderContext.query}${loaderContext.fragment}`,
    })

    Object.defineProperty(loaderContext, 'request', {
        get: () => loaderContext.loaders.map(l => l.request).concat(loaderContext.resource).join('!')
    })
    Object.defineProperty(loaderContext, 'remainingRequest', {
        get: () => loaderContext.loaders.slice(loaderContext.index + 1).map(l => l.request).concat(loaderContext.resource).join('!')
    })
    Object.defineProperty(loaderContext, 'currentRequest', {
        get: () => loaderContext.loaders.slice(loaderContext.index).map(l => l.request).concat(loaderContext.resource).join('!')
    })
    Object.defineProperty(loaderContext, 'previousRequest', {
        get: () => loaderContext.loaders.slice(0, loaderContext.index).map(l => l.request).concat(loaderContext.resource).join('!')
    })
    Object.defineProperty(loaderContext, 'query', {
        get: () => {
            let loaderObj = loaderContext.loaders[loaderContext.index];
            return loaderObj.options || loaderObj.query;
        }
    })
    Object.defineProperty(loaderContext, 'meta', {
        get: () => loaderContext.loaders[loaderContext.index].meta
    })

    const processOptions = { resourceBuffer: null }
    interatePitchLoaders(processOptions, loaderContext, callback);
}

function interatePitchLoaders(processOptions, loaderContext, callback) {
    if (loaderContext.loaderIndex >= loaderContext.loaders.length - 1) {
        // 文件读取
        loaderContext.loaderIndex--;
        return processResource(processOptions, loaderContext, callback);
    }
    const loaderObj = loaderContext.loaders[loaderContext.index];
    if (loaderObj.pitchExecuted) {
        loaderContext.index++;
        return interatePitchLoaders(processOptions, loaderContext, callback);
    }
    loaderObj.pitchExecuted = true;
    const pitchFn = loaderObj.pitch;
    executeLoader(pitchFn, loaderContext, [loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.meta], (err, ...args) => {
        if (args.length > 0) { // pitch有返回值
            loaderContext.index--;
            interateNormalLoaders(processOptions, loaderContext, args, callback);
        } else {
            interatePitchLoaders(processOptions, loaderContext, callback);
        }
    });
}

function processResource(processOptions, loaderContext, callback) {
    const resourcePath = loaderContext.resourcePath;
    loaderContext.readResource(resourcePath, (err, resultBuffer) => {
        if (err) callback(err);
        processOptions.resourceBuffer = resultBuffer;
        interateNormalLoaders(processOptions, loaderContext, [resultBuffer], callback);
    })
}

function interateNormalLoaders(processOptions, loaderContext, args, callback) {
    if (loaderContext.index < 0) return callback(null, args);
    const currentLoaderObj = loaderContext.loaders[loaderContext.index];
    if (currentLoaderObj.normalExecuted) {
        currentLoaderObj.index--;
        return interateNormalLoaders(processOptions, loaderContext, args, callback);
    }

    currentLoaderObj.normalExecuted = true;
    const normalFn = currentLoaderObj.normal;
    convertArgs(args, currentLoaderObj.raw);
    executeLoader(normalFn, loaderContext, args, (err, ...values) => {
        interateNormalLoaders(processOptions, loaderContext, values, callback);
    })
}

function convertArgs(args, raw) {
    if (raw && Buffer.isBuffer(args[0])) {
        args[0] = Buffer.from(args[0]);
    } else if (!raw && Buffer.isBuffer(args[0])) {
        args[0] = args[0].toString('utf8');
    }
}


function executeLoader(loader, context, args, callback) {
    let isSync = true;
    let isDone = false;
    const innerCallback = context.callback = function (err, ...args) {
        isSync = false;
        isDone = true;
        // TODO
        callback.apply(null, args)
    }

    context.async = function () {
        isSync = false;
        return innerCallback;
    }

    const result = fn.apply(context, args);
    if (isSync) {
        isDone = true;
        return callback(null, result);
    }
}

/**
 * 
 * @param {string} loaderAbsPath 
 */
function createLoaderObject(loaderAbsPath) {
    const loaderObj = {
        path: '',
        query: '',
        fragment: '',
        normal: null, // => loader function
        pitch: null, // => pitch function
        raw: false,
        meta: {},
        pitchExecuted: false,
        normalExecuted: false,
    }

    Object.defineProperty(loaderObj, 'request', {
        get: () => {
            return loaderAbsPath;
        },
        set: (loaderAbsPath) => {
            const { path: resourcePath, query: resourceQuery, fragment: resourceFragment } = parsePathQueryFragment(loaderAbsPath);
            loaderObj.path = resourcePath;
            loaderObj.query = resourceQuery;
            loaderObj.fragment = resourceFragment;
        }
    });

    loader.request = loaderAbsPath;

    const loader = require(loaderObj.path);
    loaderObj.normal = loader;
    loaderObj.raw = loader.raw || false;
    loaderObj.pitch = loader.pitch || (i => i)

    return loaderObj;
}

module.exports = {
    runLoaders
}