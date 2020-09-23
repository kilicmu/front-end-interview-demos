/**
 * 一个首位触发的节流
 * @param {Function} fn
 * @param {Number} timeout
 */
const throttle = function (fn, timeout) {
  let timer = null;
  let preTime = 0;
  return (...args) => {
    let curTime = Date.now();
    if (curTime - preTime >= timeout) {
      preTime = curTime;
      fn.apply(this, args);
      return;
    }

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, timeout);
  };
};

/**
 * 防抖喽
 * @param {Function} fn
 * @param {Number} timeout
 */

const debounce = function (fn, timeout) {
  let timer = null;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, timeout);
  };
};

module.exports = {};
