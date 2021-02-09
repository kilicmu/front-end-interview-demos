class Emitter {
  cbs = {};

  emit(event, ...args) {
    if (this.cbs[event]) {
      this.cbs[event].forEach((item) => item.call(this, args));
    }
  }

  on(event, cb) {
    if (!this.cbs[event]) this.cbs[event] = [];
    this.cbs[event].push(cb);
  }

  once(event, cb) {
    const tmp = () => {
      cb();
      this.off(event, tmp);
    };
    this.on(event, tmp);
  }

  off(event, cb) {
    if (!this.cbs[event]) return;
    const eCbs = this.cbs[event];
    eCbs.splice(eCbs.indexOf(cb), 1);
  }
}





class Emitter {
  cbs = {};

  on(ev, fn) {
    if(!cbs[ev]) cbs[ev] = [];
    cbs[ev].push(fn);
  }
  off(ev, fn){
    if(!cbs[ev]) cbs[ev] = []; 
    let i = 0;
    for( ;i < cbs[ev].length; ++i){
      if(cbs[ev][i].t){
        if(cbs[ev][i].t === fn) break;
      }
      if(cbs[ev][i] === fn) {
        break;
      }
    }
    cbs[ev].splice(i, 1);
  }
  once(ev, fn){
    function tmpFn() {
      fn.call(this);
      this.off(fn);
    }
    tmpFn.t = fn;
    this.on(ev, tmpFn);
  }
  emit(ev){
    cbs[ev] && cbs[ev].forEach((fn) => fn())
  }
}
