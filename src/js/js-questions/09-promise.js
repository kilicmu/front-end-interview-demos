const STATES = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2,
};

const _resolve = (promise, x, resolve, reject) => {
  let called = false;
  if (promise === x) throw new Error("");
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            _resolve(promise, y, resolve, reject);
          },
          (e) => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
};

class Promise {
  constructor(execute) {
    this.status = STATES.PENDING;
    this.value = null;
    this.reason = null;
    this.fulfilledCbs = [];
    this.rejectedCbs = [];
    const resolve = (_value) => {
      if (this.status === STATES.PENDING) {
        this.status = STATES.FULFILLED;
        this.value = _value;
        this.fulfilledCbs.forEach((_i) => _i());
      }
    };
    const reject = (_reason) => {
      if (this.status === STATES.PENDING) {
        this.status = STATES.FULFILLED;
        this.reason = _reason;
        this.rejectedCbs.forEach((_i) => _i());
      }
    };

    try {
      execute(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== "function") {
      onFulfilled = () => this.value;
    }
    if (typeof onRejected !== "function") {
      onRejected = () => {
        throw this.reason;
      };
    }
    const _promise = new Promise((resolve, reject) => {
      if (this.status === STATES.FULFILLED) {
        setImmediate(() => {
          try {
            const x = onFulfilled(this.value);
            _resolve(_promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === STATES.REJECTED) {
        setImmediate(() => {
          try {
            const x = onRejected(this.reason);
            _resolve(_promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === STATES.PENDING) {
        this.fulfilledCbs.push(() => {
          try {
            const x = onFulfilled(this.value);
            _resolve(_promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        this.rejectedCbs.push(() => {
          try {
            const x = onRejected(this.reason);
            _resolve(_promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
    });

    return _promise;
  }
}
/**
 * 以下为promise相关题目，如果需要完整Promise A+的promise实现可以找我以前的blog
 */

// Promise.all

/**
 *
 * @param {Array} promises
 */
Promise.all = function (promises) {
  let count = 0;
  const len = promises.length,
    ret = new Array(len);

  return new Promise((resolve, reject) => {
    for (let i = 0; i < len; ++i) {
      ret[i] = promises[i].then((d) => {
        ret[i] = d;
        count++;
        if (count === len) {
          resolve(ret);
        }
      }, reject);
    }
  });
};

// const p1 = Promise.resolve(1);
// const p2 = Promise.resolve(2);
// const p3 = Promise.reject(3);

Promise.all([p1, p2, p3])
  .then((d) => console.log(d))
  .catch((e) => {
    console.log(e);
  });
// Promise.race
/**
 *
 * @param {Array} promises
 */
Promise.race = function (promises) {
  let count = 0;
  const len = promises.length;

  return new Promise((resolve, reject) => {
    for (let i = 0; i < len; ++i) {
      ret[i] = promises[i].then((d) => {
        resolve(d);
      }, reject);
    }
  });
};

// 做测试
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
