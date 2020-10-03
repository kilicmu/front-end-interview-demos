function random(array) {
  return array.sort(() => Math.random() - 0.5);
}

function random(array) {
  let len = array.length;
  while (len > 1) {
    const to = Math.floor(Math.random() * len--);
    [array[to], array[len]] = [array[len], array[to]];
  }
  return array;
}

console.log(random([1, 2, 3, 4, 5, 6, 7, 8]));
