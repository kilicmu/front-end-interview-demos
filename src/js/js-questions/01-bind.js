/**
 * apply mock
 * @param {Object} ctx
 * @param {Array} params
 */
Function.prototype.apply = function (ctx, params) {
  ctx.fn = this;
  return ctx.fn(...params);
};

/**
 * mock bind
 * 这里加个注释：
 *  如果被bind后的函数作为构造函数，则需要以原函数作为构造函数
 *  并且需要绑定原函数的原型链
 * @param {object} ctx
 * @param  {...any} params
 */
Function.prototype.bind = function (ctx, ...params) {
  const self = this;
  function fn(args) {
    if (this instanceof fn) {
      const obj = new self(...params, ...args);
      obj.setPrototypeOf(self.prototype);
      return obj;
    }
    return self.apply(ctx, params.concat(args));
  }

  return fn;
};

/**
 * someting may be you dont know
 * @param {Array} arr
 */
function getMax(arr) {
  return Math.max.apply({}, arr);
}

module.exports = {
  getMax,
};
