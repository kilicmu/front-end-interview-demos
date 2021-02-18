const t = require("babel-types");
const { sources } = require("webpack");

// import { concat } from "lodash"; => import concat from "lodash/concat"

const visitor = {
    ImportDeclaration: {
        enter(path, { opts = {} }) {
            const { node } = path;
            const specifiers = node.specifiers;
            const source = node.source;
            if (opts.libraryName === source.value && !t.isImportDefaultSpecifier(specifiers[0])) {
                const defaultImportDeclarations = specifiers.map(specifier => {
                    const importDefaultSpecifier = t.importDefaultSpecifier(specifier.local)
                    return t.importDeclaration([importDefaultSpecifier], t.stringLiteral(`${opts.libraryName}/${opts.libraryDirectory}/${specifier.local.name}`))
                });
                console.log(defaultImportDeclarations)
                path.replaceWithMultiple(defaultImportDeclarations);
            }
        }
    }
}

module.exports = function (babel) {
    return {
        visitor
    }
}