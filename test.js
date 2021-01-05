function calculateStatistics(dataArr) {
    const mid = dataArr.length % 2 ? Math.floor(dataArr[Math.floor(dataArr.length / 2) - 1] + dataArr[Math.floor(dataArr.length / 2)]) / 2 : dataArr[Math.floor(dataArr.length / 2)];

    dataArr = dataArr.sort((a, b) => a - b);
    const min = dataArr[0];
    const max = dataArr[dataArr.length - 1];
    const top90 = dataArr[dataArr.length * 0.9 - 1];
    return [mid, min, max, top90]

}

console.log(calculateStatistics([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]))