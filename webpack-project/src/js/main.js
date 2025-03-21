import "../css/normalize.min.css";
import "../lib/layer_mobile/layer.css";
// import "../css/animate.min.css";
// import "swiper/swiper-bundle.min.css";
// import "../css/m.css";
import "../css/pc.css";
import "../css/style.css";
import "../css/pop.css";

import $ from "jquery";
import layer from "../lib/layer_mobile/layer";
// import Swiper, { Mousewheel, EffectFade, Autoplay, Navigation } from "swiper";
import { $$, dialogClose, dialogShow } from "../js/common.js";
// import { gaInit } from "../lib/ga.js";

// 页面状态
let options = {
  isLogin: 0,
  is_share: 0,
};

// 接口 - 模拟登录
async function testLogin() {
  const fetchOption = {
    method: "get",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // body: new URLSearchParams({}),
  };
  const response = await fetch("/pre/test-login", fetchOption);
  const res = await response.json();

  if (res.code == 0) {
  }
}

// 通用
function common() {
  // GA
  // gaInit();

  // 弹窗 - 关闭
  $(".btn-close").click(function () {
    dialogClose();
  });

  // 弹窗 - 视频
  $(document).on("click", ".vPlay", function () {
    let vUrl = this.getAttribute("data-v");
    $$(".dialog-video video").setAttribute("src", vUrl);
    $$(".dialog-video video").play();
    dialogShow("dialog-video");
  });

  $(".dialog-video .btn-close").click(function () {
    dialogClose();
    $$(".dialog-video video").setAttribute("src", "");
  });
}

// 首页
async function home() {
  common();
}

// 初始化
function init() {
  home();
}

window.addEventListener("DOMContentLoaded", function () {
  init();
});
