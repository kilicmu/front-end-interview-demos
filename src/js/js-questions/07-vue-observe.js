function observe(data) {
  if (!(typeof data == "object")) {
    return;
  }

  return new Observer(data);
}

class Observer {
  constructor(data) {
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false,
      configurable: false,
    });

    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods; // 重写的array原型
    } else {
      this.walk(data);
    }
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "object") observe(data[key]);
      defineReactive(data, key, data[key]);
    });
  }
}

function defineReactive(data, key, value) {
  const dep = new Dep();
  observe(value);
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      if (Dep.target) {
        dep.depend(); // 此处是依赖收集
      }
      return value;
    },
    set: function (nVal) {
      if (value === nVal) return;
      observe(nVal);
      value = nVal;
      dep.notify(); // 此处是视图刷新
    },
  });
}
