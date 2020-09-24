/**
 * es5模拟es6
 */

// let
for (let i = 0; i < length; ++i) {
  console.log(i);
}
// babel:
for (let _i = 0; _i < length; ++_i) {
  console.log(_i);
}
// functional:
(function () {
  for (let i = 0; i < length; ++i) {
    console.log(i);
  }
})();

// const
function _const(key, value) {
  const desc = {
    value,
    writable: false,
  };

  Object.defineProperty(window, key, desc);
}
