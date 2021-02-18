// 手动开启一个webpack dev server
const express = require("express");
const app = express();
const webpack = require("webpack");
const webpackOptions = require("../webpack.config");
const webpackDevMiddleware = require("webpack-dev-middleware");
// webpackOptions.mode = "development";
// console.log(webpackOptions)
const complier = webpack(webpackOptions());

app.use(webpackDevMiddleware(complier, {}));

app.listen(8000);