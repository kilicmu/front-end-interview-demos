/**
 * this function will extend his father
 * @param {Function} SuperFn parent function
 */
function extend(SonFn, SuperFn) {
  const prototype = Object.create(SuperFn.prototype);
  prototype.constructor = SonFn;
  SonFn.prototype = prototype;
}

module.exports = {
  extend,
};
