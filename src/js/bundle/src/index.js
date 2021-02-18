let a = 1;
let b = 2;
// const path = require("path")
const RunPlugin = require("./plugins/RunPlugin");
// const jsonLoader = require("./loaders/json-loader.js");
const name = require("./data/name");
const image = require("./images/test2.jpg");
require('./index.less');
const json = require('./test.json');

console.log(json);

const getName = () => name;
const imgEl = document.createElement('img');
imgEl.src = '/' + image;
document.body.appendChild(imgEl);

console.log(getName)