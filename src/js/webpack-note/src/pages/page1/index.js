// import "./index.css"
// const css = require("index.css")
import txt from './index.txt';
import '../../css/index.css';
import '../../style/test.less';
import '../../style/test.scss';
// import img from './assets/test.gif';
import 'lib-flexible';

// import('../../js/desc').then((a) => { console.log('module', a); });
// import './js/desc';

// const imgEl = document.createElement('img');
// imgEl.src = img;
// document.body.appendChild(imgEl);

const sum = (a, b) => a + b;

document.write(txt);
console.log(sum(1, 2));

console.log(_.concat([1, 2, 3], [4, 5, 6]));

console.log(require.resolve('lodash'));

// console.log(DEVELOPMENT);

console.log(process.env.NODE_ENV);

// new Promise((res) => { res(1); }).then((d) => console.log(d));

// console.log(a);
