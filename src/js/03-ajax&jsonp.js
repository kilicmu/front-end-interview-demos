const ajax = function (params = {}) {
  if (!params.url) return;
  let url = params.url;
  const method = (params?.method ?? "GET").toUpperCase();
  const data = params?.data ?? null;
  const success = params?.cb;
  const fail = params?.fail;
  const timeout = params?.timeout ?? 1000;
  const xhr = new XMLHttpRequest();

  xhr.timeout = timeout;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === xhr.HEADERS_RECEIVED) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        cb(xhr.responseText);
      }
    }
  };
  xhr.onerror = (error) => fail(error);

  if (method === "GET" && data) {
    const encodeData = Object.keys(data).map((key) => `${key}=${data[key]}`);
    url += url.indexOf("?") === -1 ? "?" : "&";
    url += encodeData.join("&");
  }

  xhr.open(method, url);

  if (method === "POST") {
    xhr.setRequestHeader(("Content-type": "application/json"));
    xhr.send(data);
  } else {
    xhr.send();
  }
};

count = 0;
const jsonp = function (params) {
  if (!params.url) return;

  const url = params?.url;
  const data = params?.data;
  const cb = params?.cb;
  const success = params?.success;

  const scriptElm = document.createElement("script");
  const bodyElm = document.querySelector("body");

  const cbName = `cb${count++}`;
  window[cbName] = function (result) {
    success(result);
    delete window[cbName];
    bodyElm.removeChild(scriptElm);
  };

  scriptElm.src = url;
  bodyElm.appendChild(scriptElm);
};
