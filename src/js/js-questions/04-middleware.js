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



function compose(middlewares) {
  return function(context, next){
    return dispatch(0)
    function dispatch(i) {
      if(i === middlewares.length) Promise.resolve();
      const fn = middlewares[i];
      try{
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      }catch(e){
        return Promise.reject(e);
      }
    }
  }
}