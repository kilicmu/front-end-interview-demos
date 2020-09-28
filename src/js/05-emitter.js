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
