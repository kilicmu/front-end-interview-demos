const {rRequire} = require("../src/js/23-commonjs");
const path = require('path');


const jsonData = rRequire(path.resolve(__dirname, './datas/json-data.json'));

console.log(jsonData);