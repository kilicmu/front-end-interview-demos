
// yarn add esprima estraverse escodegen -D
require("./test")


function mySqrt(x) {
    for (let i = 0; i < x; ++i) {
        if (i ** 2 <= x && (i + 1) ** 2 > x) {
            return i;
        }
    }
};

console.log(mySqrt(9));

