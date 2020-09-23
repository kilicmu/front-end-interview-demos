/**
 * 以下为promise相关题目，如果需要完整Promise A+的promise实现可以找我以前的blog
 */

// Promise.all

/**
 *
 * @param {Array} promises
 */
Promise.all = function (promises) {
  let count = 0;
  const len = promises.length,
    ret = new Array(len);

  return new Promise((resolve, reject) => {
    for (let i = 0; i < len; ++i) {
      ret[i] = promises[i].then((d) => {
        ret[i] = d;
        count++;
        if (count === len) {
          resolve(ret);
        }
      }, reject);
    }
  });
};

const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.reject(3);

Promise.all([p1, p2, p3])
  .then((d) => console.log(d))
  .catch((e) => {
    console.log(e);
  });
// Promise.race
/**
 *
 * @param {Array} promises
 */
Promise.race = function (promises) {
  let count = 0;
  const len = promises.length;

  return new Promise((resolve, reject) => {
    for (let i = 0; i < len; ++i) {
      ret[i] = promises[i].then((d) => {
        resolve(d);
      }, reject);
    }
  });
};
