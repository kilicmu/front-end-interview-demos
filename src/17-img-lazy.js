(function () {
  const $ = (s) => document.querySelectorAll(s);
  let imgList = $("img");
  let newList = [];
  const innerH = window.innerHeight;
  function handlerScroll(preHeight) {
    for (let i = 0; i < imgList.length; ++i) {
      const t = imgList[i].getBoundingClientRect().top;
      console.log(t, innerH);
      if (t < innerH + preHeight) {
        console.log(imgList[i].getAttribute("data-src"));
        imgList[i]["src"] = imgList[i].getAttribute("data-src");
      } else {
        newList.push(imgList[i]); //这里把已加载的去重
      }
    }
    imgList = newList;
    newList = []; // 数组置换
  }
  handlerScroll();
  document.addEventListener("scroll", handlerScroll);
})();
