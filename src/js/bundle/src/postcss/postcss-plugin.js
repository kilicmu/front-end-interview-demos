const postcss = require('postcss')

const plugin = (options) => {
    return (root, result) => {
        root.walkDecls((decl) => {
            if(decl.value.endsWith('px')) {
                decl.value = parseFloat(decl.value) / 75 + 'rem';
            }
        });
    }
}

const options = {};
const pipeline = postcss([plugin(options)]);

const source = `
    #input {
        width: 750px;
    }
`

pipeline.process(source).then((res) => {
    console.log(res.css)
})