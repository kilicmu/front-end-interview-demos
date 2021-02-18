const webpack = require("./index.js");
const config = require("../../webpack.config");

const compiler = webpack(config);

compiler.run((err, stat) => {
    // stat.toJson();
    console.log(stat.toJson());
});