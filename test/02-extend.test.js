const { it } = require("mocha");

const mocha = require("mocha");
const { expect } = require("chai");
const { extend } = require("../src/02-extend");

describe("test extend function", () => {
  it("test extend", () => {
    const template = (name, age) => `hello, my name is ${name}, age is ${age}`;
    const name = "kilic",
      age = 10;

    function Father(name) {
      this.name = name;
    }

    Father.prototype = {
      introduce: function () {
        return template(this.name, this.age);
      },
    };

    function Son(name, age) {
      Father.call(this, name);
      this.age = age;
    }

    extend(Son, Father);

    const son = new Son(name, age);

    expect(son.introduce()).to.equal(template(name, age));
  });
});
