function initResize() {
  
  // 设备检测函数
  function deviceTest() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )
      ? "mobile"
      : "desktop";
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize); // 监听设备方向变化
  function resize() {
    const desktopDesignRatio = 2560 / 1440; // 桌面端设计比例
    const desktopWidth = 2560; // 桌面端设计宽度
    const desktopHeight = 1440; // 桌面端设计高度
    const mobileDesignRatio = 750 / 1334; // 移动端设计比例
    const mobileWidth = 750; // 移动端设计宽度
    const mobileHeight = 1334; // 移动端设计高度

    const deviceResult = deviceTest();
    console.log("deviceResult: ", deviceResult);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const viewRatio = width / height; // 视口宽高比

    let ratio = 1;  // 计算比例

    let fontSize = 100; // 基础字体大小

    if (deviceResult == "mobile") {
      // 移动端使用750作为基准宽度和1334作为基准高度
      viewRatio < mobileDesignRatio ?  ratio = width / mobileWidth : ratio = height / mobileHeight; 

    } else {
      // 桌面端使用2560作为基准宽度和1440作为基准高度
      viewRatio < desktopDesignRatio ? ratio = width / desktopWidth : ratio = height / desktopHeight;
      
      // document.querySelector("html").style.minWidth =
      //   viewRatio > desktopDesignRatio ? "inherit" : height * desktopDesignRatio + "px"; // 设置最小宽度
      ratio < 0.625 && (ratio = 0.625); // 最小缩放比例为0.5
      document.querySelector("html").style.minWidth = 1200 + "px";
    }

    fontSize = fontSize * ratio;

    document.querySelector("html").style.fontSize = fontSize + "px";
    document.documentElement.style.setProperty("--ratio", ratio);

    setViewHeight();
  }

  document.addEventListener("DOMContentLoaded", setViewHeight);

  function setViewHeight() {
    const windowVH = window.innerHeight / 100;
    document.documentElement.style.setProperty("--vh", windowVH + "px");
  }
}

initResize();
