class SyncValve {
  constructor(max) {
    this.cache = [];
    this.ret = [];
    this.count = 0;
    this.blocking = null;
    this.max = max
  }

  addTask(task, cb) {
    this.cache.push(() => cb(task))
  }

  async run() {
    for (let i of this.cache) {
      console.log(this.count)
      this.count++;
      this.ret.push(i().then(d => {
        this.count--;
        this.blocking && this.blocking();
        this.blocking = null;
        return d;
      }))

      if (this.count < this.max) {
        continue
      } else {
        await this.getBlocking();
      }
    }
    console.log(this.ret);
    return Promise.all(this.ret)
  }

  getBlocking() {
    return new Promise((res, rej) => { this.blocking = res })
  }

}

function request(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
}





async function main() {
  const sv = new SyncValve(3);
  const p = new Promise((res, rej) => {
    [1000, 2000, 3000, 2000, 5000].forEach((it) => {
      sv.addTask(it, request);
    });
  });
  try {
    const ret = await sv.run()
    console.log(ret);
  } catch (e) {
    console.log(e)
  }

}

main()

