const { it } = require("mocha");
const { expect } = require("chai");
const { compose } = require("../src/04-middleware");

function testArray(arr1, arr2) {
  expect(arr1.length).to.equal(arr2.length);
  for (let i in arr2) {
    expect(arr1[i]).to.equal(arr2[i]);
  }
}
describe("test middleware", () => {
  it("middleware", (done) => {
    const array = [];
    const expectArray = [1, 2, 3, 4];
    async function fn1(ctx, next) {
      array.push(1);
      await next();
      array.push(4);
      testArray(array, expectArray);
      done();
    }

    async function fn2(ctx, next) {
      array.push(2);
      await next();
      array.push(3);
    }

    compose([fn1, fn2])({}, () => 0);
  });
});
