const typeArray = [Date, RegExp]; // 可扩展

const isSpecial = function (instance) {
  for (const Type of typeArray) {
    if (instance instanceof Type) {
      return [true, Type];
    }
  }
  return [false, null];
};

/**
 *  比较完善的深拷贝
 * @param {Object} data
 * @param {WeakMap} wmap
 */
const deepCopy = function (data, wmap = new WeakMap()) {
  if (wmap.has(data)) return wmap.get(data);
  const [isComplex, Type] = isSpecial(data);
  if (isComplex) {
    return new Type(data);
  }
  const ret = {};
  wmap.set(data, ret);
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === "object") {
      const tmp = deepCopy(data[key], wmap);
      ret[key] = tmp;
    } else {
      ret[key] = data[key];
    }
  });
  return ret;
};

var obj1 = {
  a: 1,
  b: {
    c: 2,
    d: new Date(),
    o: /\w+/,
  },
  c: {
    h: 1,
  },
};

obj1.b.e = obj1.b;
obj1.b.f = obj1.b;

const obj2 = deepCopy(obj1);
obj2.b.c = 10;

console.log(obj1, obj2);
console.log(obj2.b.o === obj1.b.o);
