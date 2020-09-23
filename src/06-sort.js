/**
 * 这里感觉front-end会使用自带的sort和快排就够了，如果有时间会继续补充
 */

/**
 * 自带sort
 * @param {Array} arr
 */
function sort(arr) {
  return arr.sort((a, b) => a - b);
}

/**
 *快拍
 * @param {Array} arr
 */
function QSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.round(arr.length / 2);
  const left = [],
    right = [];
  const [sentry] = arr.splice(mid, 1);
  console.log(mid);

  for (let item of arr) {
    if (item > sentry) {
      right.push(item);
    } else {
      left.push(item);
    }
  }

  return QSort(left).concat([sentry], QSort(right));
}
