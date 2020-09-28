/**
 * 一个意义不明的题，用setTimeout 模拟setInterval
 * @param {*} cb
 * @param {*} time
 */
function setInterval(cb, time) {
  return setTimeout(() => {
    cb();
    setInterval(cb, time);
  }, time);
}

timer = setInterval(() => {
  console.log(1);
}, 1000);
