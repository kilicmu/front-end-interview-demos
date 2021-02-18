module.exports = function loader(source) {
    console.warn('test loader');
    return source + '// loadered'
}