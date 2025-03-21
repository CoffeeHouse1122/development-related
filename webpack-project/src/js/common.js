// 获取dom
export function $$(ele, all) {
  return all ? document.querySelectorAll(ele) : document.querySelector(ele);
}

// tab切换
export function tab(item, index) {
  $$(item, true).forEach((ele, i) => {
    if (i != index) {
      ele.classList.remove("cur");
    } else {
      ele.classList.add("cur");
    }
  });
}

// 获取url参数
export function getQueryString(queryName) {
  let reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

// 弹窗 - 关闭
export function dialogClose() {
  document.querySelectorAll(".dialog").forEach((element, index) => {
    element.classList.remove("on");
  });
  document.querySelector(".dialog-mask").classList.remove("on");
}

// 弹窗 - 打开
export function dialogShow(type, content = null) {
  if (type == "dialog-common") {
    document.querySelector(".dialog-common .dialog-con p").textContent =
      content;
  }
  // if (type == "dialog-comfirm") {
  //   document.querySelector(".dialog-comfirm .dialog-comfirm-tips").textContent =
  //     content;
  // }
  document.querySelector(`.${type}`).classList.add("on");
  document.querySelector(".dialog-mask").classList.add("on");
}

// 时间戳转时间格式
export function timestampToTime(timestamp) {
  let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear();
  let M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  return {
    Y: Y,
    M: M,
    D: D,
    h: h,
    m: M,
    s: s,
  };
}

// 时间运算  返回时、分
export function dateCalculation(second) {
  if (second > 0) {
    let hour = 0;
    let minute = 0;
    let data = {};
    minute = Math.ceil(second / 60);
    if (parseInt(minute) >= 60) {
      hour = parseInt(minute / 60);
      minute %= 60;
    }
    data.hour = hour;
    data.minute = minute;
    return data;
  } else {
    return {
      hour: 0,
      minute: 1,
    };
  }
}

// 下载图片
export function downloadByBlob(Url) {
  var blob = new Blob([""], { type: "application/octet-stream" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = Url;
  a.download = Url.replace(/(.*\/)*([^.]+.*)/gi, "$2").split("?")[0];
  var e = document.createEvent("MouseEvents");
  e.initMouseEvent(
    "click",
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(e);
  URL.revokeObjectURL(url);
}

// base64 转 file
export function base64ConvertFile(urlData, filename) {
  if (typeof urlData != "string") {
    return;
  }
  let arr = urlData.split(",");
  let type = arr[0].match(/:(.*?);/)[1];
  let fileExt = type.split("/")[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${filename}.` + fileExt, {
    type: type,
  });
}

// url 转 base64
export function convertImgToBase64(url, callback, outputFormat) {
  var canvas = document.createElement("CANVAS"),
    ctx = canvas.getContext("2d"),
    img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat || "image/png");
    callback.call(this, dataURL);
    canvas = null;
  };
  img.src = url + `?${new Date().getTime()}`;
}

// 移动端禁止双击放大
export function banDoubleClick() {
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (event) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
  document.addEventListener("gesturestart", (event) => {
    event.preventDefault();
  });
}
