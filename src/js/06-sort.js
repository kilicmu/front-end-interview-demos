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

  for (let item of arr) {
    if (item > sentry) {
      right.push(item);
    } else {
      left.push(item);
    }
  }

  return QSort(left).concat([sentry], QSort(right));
}


function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const lArr = arr.slice(0, mid);
  const rArr = arr.slice(mid);
  return merge(mergeSort(lArr), mergeSort(rArr));

  function merge(left, right) {
    const ret = [];
    while (left.length && right.length) {
      if (left[0] > right[0]) {
        ret.push(right.shift());
      } else {
        ret.push(left.shift());
      }
    }
    return ret.concat(left, right);
  }
}


console.log(mergeSort([1, 3, 5, 2, 15, 6, 8, 10]))
