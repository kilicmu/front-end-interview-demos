
function loader(source) {
    console.log(source);
    return `module.exports = "${source}"`;
}

module.exports = loader