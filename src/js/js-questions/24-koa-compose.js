

const middlewares = [];

const use = (fn) => {
    middlewares.push(fn);
}

const compose = (middlewares) => {
    return function (ctx, next) {
        return dispatch(0);
        function dispatch(idx) {
            if(idx >= middlewares.length) return;
            const fn = middlewares[idx];
            try{
                return Promise.resolve(fn(ctx, dispatch.bind(null, idx+1)));
            }catch(e){
                return Promise.reject(e);
            }
        }
    }
}

use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(4);
});

use(async (ctx, next) => {
  console.log(2);
  await next();
  console.log(3);
});

compose(middlewares)({}, ()=>{});