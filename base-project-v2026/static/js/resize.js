/**
 * 响应式适配脚本
 * 
 * 通过动态计算 html font-size 实现 rem 适配，同时输出 CSS 变量：
 *   --ratio : 当前缩放比（可用于 transform 等场景）
 *   --vh    : 真实 1vh 值（解决移动端地址栏导致 100vh 不准的问题）
 * 
 * 设计稿基准：
 *   PC 端   : 2560 × 1440  →  1rem = 100px
 *   移动端  : 750 × 1334   →  1rem = 100px
 */
(function initResize() {

  // ==================== 配置项 ====================
  var CONFIG = {
    desktop: { width: 2560, height: 1440 },  // PC 端设计稿尺寸
    mobile:  { width: 750,  height: 1334 },  // 移动端设计稿尺寸
    baseFontSize: 100,                        // 基础字体大小（1rem = 100px）
    minRatio: 0.625,                          // PC 端最小缩放比
    minWidth: 1200                            // PC 端最小宽度（px）
  };

  // ==================== 工具函数 ====================
  var htmlEl = document.documentElement;
  var isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );

  // 防抖：resize 高频触发时节流执行
  var resizeTimer = null;
  function debounce(fn, delay) {
    return function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fn, delay);
    };
  }

  // ==================== 核心逻辑 ====================
  function resize() {
    var design = isMobile ? CONFIG.mobile : CONFIG.desktop;
    var designRatio = design.width / design.height;

    var width  = window.innerWidth;
    var height = window.innerHeight;
    var viewRatio = width / height;

    // 取较小方向缩放，保证设计稿内容完整可见
    var ratio = viewRatio < designRatio
      ? width / design.width
      : height / design.height;

    // PC 端限制最小缩放 & 最小宽度
    if (!isMobile) {
      if (ratio < CONFIG.minRatio) ratio = CONFIG.minRatio;
      htmlEl.style.minWidth = CONFIG.minWidth + "px";
    }

    htmlEl.style.fontSize = (CONFIG.baseFontSize * ratio) + "px";
    htmlEl.style.setProperty("--ratio", ratio);

    updateVH();
  }

  function updateVH() {
    htmlEl.style.setProperty("--vh", (window.innerHeight / 100) + "px");
  }

  // ==================== 初始化 ====================
  var debouncedResize = debounce(resize, 100);

  resize();                                                     // 立即执行一次
  window.addEventListener("resize", debouncedResize);           // 窗口尺寸变化
  window.addEventListener("orientationchange", function () {    // 移动端横竖屏切换
    // orientationchange 后尺寸不会立即更新，延迟执行
    setTimeout(resize, 200);
  });

  // DOMContentLoaded 时再校准一次 --vh（确保 DOM 就绪后准确）
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateVH);
  }

})();
