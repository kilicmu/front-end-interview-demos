function co(gen) {
  return new Promise((resolve, reject) => {
    (function next(val) {
      const { value, done } = gen.next(val);
      if (done) resolve(value);
      Promise.resolve(value).then((data) => {
        next(data);
      });
    })(null);
  });
}
