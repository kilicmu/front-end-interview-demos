// import "./index.css"
// const css = require("index.css")
import txt from "./index.txt"
// import "./css/index.css";
import "./style/test.less";
import "./style/test.scss";
import img from "./assets/test.gif";
import "./js/desc.js"

const imgEl = document.createElement('img');
imgEl.src = img;
document.body.appendChild(imgEl);


const sum = (a, b) => a+b

console.log(sum(1,2))