const flat = function (arr) {
  let i = 0;
  while (true) {
    if (Array.isArray(arr[i])) {
      const tmp = arr[i];
      arr.splice(i, 1, ...tmp);
    }
    if (i === arr.length - 1) return arr;
    ++i;
  }
};

console.log(flat([1, 2, 3, [2, 3, 4, [2]]]));
