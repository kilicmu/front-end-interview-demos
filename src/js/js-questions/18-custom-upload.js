/**
 * 自定义自己的input type=“file”
 * 这个问题考察的是dom操作是否熟练（吧
 * 这个问题还可以扩展为如何设计一个自己的文件上传
 * 其实感觉没啥意义
 */

const input = document.createElement("input");
input.type = "file";
const myDiv = document.querySelector("#upload");
myDiv.onclick = (e) => {
  input.click(); // 异步
};

// 查看文件可以用
const dataURL = function (file) {
  if (!file) return;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    dataUrl = this.result;
    document.querySelector("img-scope").innerHTML = `<img src="${dataURL} />">`;
  };
};

const dataBinary = function (file) {
  if (!file) return;
  const reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = (e) => {
    const data = e.result;
    fetch("url", {
      body: JSON.stringify({ data }),
      cache: "no-cache",
      method: "POST",
    })
      .then((resp) => resp.json())
      .then((d) => console.log(d));
  };
};
