const types = require("babel-types");


module.exports = {
    visitor: {
        ClassDeclaration(nodePath) {
            const { node } = nodePath;
            console.log(node.id)
            const { id } = node;
            const classMethods = node.body.body;
            const body = [];
            classMethods.forEach(method => {
                console.log(method.kind)
                if (method.kind === 'constructor') {
                    const constructorFn = types.functionDeclaration(id, method.params, method.body, method.generator, method.async);
                    body.push(constructorFn);
                } else {
                    const left = types.memberExpression(types.memberExpression(id, types.identifier('prototype')), method.key);
                    const right = types.functionExpression(null, method.params, method.body, method.generator, method.async);
                    const assignmentExpression = types.assignmentExpression('=', left, right);
                    body.push(assignmentExpression);
                }
            })
            nodePath.replaceWithMultiple(body);
        }
    }
}


