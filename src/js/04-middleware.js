const compose = function (middleware) {
  return function (ctx, next) {
    let idx = -1;
    return dispatch(0);

    function dispatch(n) {
      if (n <= idx) return Promise.reject();
      idx = n;
      if (idx === middleware.length) return Promise.resolve();
      const fn = middleware[n];
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, n + 1)));
      } catch (e) {
        Promise.reject(e);
      }
    }
  };
};

module.exports = {
  compose,
};
