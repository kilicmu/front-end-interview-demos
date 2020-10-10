/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
    if (nums.length == 1 && nums[0] == 0) return 1;
    const ret = [-Infinity];
    for (let i = 0; i < nums.length; ++i) {
        const max = ret[ret.length - 1];
        if (nums[i] > max) {
            ret.push(nums[i]);
        } else {
            let idx = binarySearch(ret, nums[i]);
            idx = idx >= 0 ? idx : -idx - 1;
            ret[idx] = nums[i];
        }
    }

    return ret.length - 1

};

function binarySearch(ret, searchVal) {
    let start = 0,
        end = ret.length - 1;
    let mid = 0
    while (start < end) {
        mid = Math.floor((start + end) / 2);
        if (ret[mid] === searchVal) return mid;
        if (ret[mid] < searchVal) {
            start = mid + 1;
        } else {
            end = mid;
        }
    }
    return -(start + 1)
}

console.log(lengthOfLIS())