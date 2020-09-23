const mocha = require("mocha");
const { expect } = require("chai");
const { it } = require("mocha");

describe("test find max fn", () => {
  it("max", () => {
    const { getMax } = require("../src/01-bind");
    const arr = [2, 3, 12, 41, 4];

    const ret = getMax(arr);
    expect(ret).to.equal(Math.max(...arr));
  });
});
