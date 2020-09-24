function mockNew(fn, ...args) {
  const obj = new Object();
  fn.apply(obj, args);
  obj.__proto__ = fn.prototype;
  return obj;
}

function Ctor(name, age) {
  this.name = name;
  this.age = age;
}

Ctor.prototype = {
  say: function () {
    console.log(this.name, this.age);
  },
};
const impl = mockNew(Ctor, "kilic", 12);

impl.say();
