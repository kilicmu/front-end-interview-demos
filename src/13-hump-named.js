/**
 * 这个题是面快手时候的，
 * 我自己的思路好像是有点问题，于是用了面试官提示的思路做了
 * 这里我想把那个思路重新完善
 */

function toHump(str) {
  while (true) {
    const idx = str.indexOf("-");
    console.log(idx);
    if (idx === -1 || idx === str.length - 1) break;
    const tmp = str[idx + 1];
    console.log(str, tmp);
    str = str.replace(`-${tmp}`, tmp.toUpperCase());
  }

  return str;
}

console.log(toHump("hello-world-kilic-"));
