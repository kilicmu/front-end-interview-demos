var babelPluginTransformEs2015ArrowFunctions = {
    visitor: {
        // 属性是节点类型，babel在遍历到相应的
        ArrowFunctionExpression(nodePath) { // 节点数据
            // console.log(nodePath)
            const node = nodePath.node;
            const thisBinding = hoistFunctionEnvironment(nodePath);
            node.type = "FunctionExpression";
        }
    }
}

function hoistFunctionEnvironment(fnPath) {
    const thisEnvFn = fnPath.findParent(p => {
        return p.isFunction() && !p.isArrowFunctionExpression() || p.isProgram() || p.isClassProperty({
            static: false
        });
    })
    const thisPaths = getScopeInfoInformation(fnPath);
    const thisBinding = '_this';
    if (thisPaths.length > 0) {
        thisEnvFn.scope.push({
            id: types.identifier('_this'),
            init: types.thisExpression.ThisExpression
        })
        thisPaths.forEach(thisPath => {
            const thisRef = types.identifier(thisBinding);
            thisPath.replaceWith(thisRef);
        })
    }
    // console.log(fnPath)
}

function getScopeInfoInformation(fnPath) {
    const thisPaths = [];
    fnPath.traverse({
        ThisExpression(thisPath) {
            thisPaths.push(thisPath);
        }
    })
    return thisPaths;
}