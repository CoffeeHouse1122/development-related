/**
 * Gulp 构建脚本
 *
 * 功能：
 *   1. CSS：autoprefixer + 压缩 → dist/static/css/xxx.min.css
 *   2. JS ：babel + webpack + uglify → dist/static/js/xxx.min.js
 *   3. 静态资源复制 → dist/static/
 *   4. HTML：替换引用 + 版本号 + CDN → dist/
 *   5. 输出可直接部署的完整项目到 dist/
 *
 * 命令：
 *   npm run build        → 完整构建（输出到 dist/）
 *   npm run build:css    → 仅构建 CSS
 *   npm run build:js     → 仅构建 JS
 *   npm run clean        → 清理 dist 目录
 *
 * CDN 模式：
 *   Windows PowerShell : $env:CDN_URL="https://cdn.example.com/project/"; npm run build
 *   Linux / Mac        : CDN_URL=https://cdn.example.com/project/ npm run build
 */

const { src, dest, series, parallel } = require("gulp");
const { rmSync } = require("fs");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const cleanCss = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const replace = require("gulp-replace");
const webpack = require("webpack-stream");
const named = require("vinyl-named");
const path = require("path");

// ==================== 配置 ====================

/**
 * CDN 地址（末尾需带 /）
 * 留空 = 使用相对路径（默认）
 * 示例: "https://cdn.example.com/project/"
 */
const CDN_URL = process.env.CDN_URL || "";

const DIST = "dist";

const CONFIG = {
  // 需要构建的 CSS 源文件
  css: {
    src: ["static/css/main.css", "static/css/m-main.css"],
  },
  // 需要构建的 JS 源文件
  js: {
    src: ["static/js/main.js", "static/js/m-main.js", "static/js/resize.js"],
  },
  // HTML 页面
  html: {
    root: ["index.html"],
    pc: [
      "pc/index.html",
      "pc/en/index.html",
      "pc/jp/index.html",
      "pc/kr/index.html",
      "pc/tc/index.html",
    ],
    mobile: [
      "m/index.html",
      "m/en/index.html",
      "m/jp/index.html",
      "m/kr/index.html",
      "m/tc/index.html",
    ],
  },
  // 需要复制的静态资源（排除构建源文件及其旧产物）
  static: [
    "static/**/*",
    "!static/css/main.css",
    "!static/css/main.min.css",
    "!static/css/m-main.css",
    "!static/css/m-main.min.css",
    "!static/js/main.js",
    "!static/js/main.min.js",
    "!static/js/m-main.js",
    "!static/js/m-main.min.js",
    "!static/js/resize.js",
    "!static/js/resize.min.js",
  ],
  // 其他需要复制的根文件
  misc: ["favicon.ico"],
};

// 合并所有 HTML 路径
CONFIG.html.all = CONFIG.html.root.concat(CONFIG.html.pc, CONFIG.html.mobile);

// ==================== 工具函数 ====================

// 生成版本号：YYYYMMDDHHmm
function getVersion() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes())
  );
}

// 正则特殊字符转义
function escapeRegex(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

const VERSION = getVersion();

// ==================== Clean ====================

function clean(cb) {
  rmSync(DIST, { recursive: true, force: true });
  cb();
}

// ==================== CSS 构建 ====================

function buildCss() {
  return src(CONFIG.css.src, { base: "static/css" })
    .pipe(
      autoprefixer({
        overrideBrowserslist: [
          "last 2 versions",
          "iOS >= 12",
          "Android >= 5",
          "Firefox > 20",
          "not dead",
        ],
        cascade: false,
      })
    )
    .pipe(
      cleanCss({
        specialComments: "all",
        format: "keep-breaks",
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(DIST + "/static/css"));
}

// ==================== JS 构建 ====================

function buildJs() {
  return src(CONFIG.js.src, { base: "static/js" })
    .pipe(
      named(function (file) {
        return path.basename(file.path, path.extname(file.path));
      })
    )
    .pipe(
      webpack({
        mode: "none",
        output: { filename: "[name].min.js" },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    ["@babel/preset-env", { useBuiltIns: false }],
                  ],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(uglify({ mangle: { toplevel: true } }))
    .pipe(dest(DIST + "/static/js"));
}

// ==================== 复制静态资源 ====================

function copyStatic() {
  return src(CONFIG.static, { base: ".", encoding: false, allowEmpty: true })
    .pipe(dest(DIST));
}

function copyMisc() {
  return src(CONFIG.misc, { base: ".", encoding: false, allowEmpty: true })
    .pipe(dest(DIST));
}

// ==================== HTML 处理 ====================

function processHtml() {
  const replacements = [];

  // CSS: main.css → main.min.css?v=xxx
  CONFIG.css.src.forEach(function (filePath) {
    const base = path.basename(filePath, ".css");
    replacements.push({
      pattern: new RegExp(
        "/" + escapeRegex(base) + '(\\.min)?\\.css(\\?v=[^"\'\\s]*)?',
        "g"
      ),
      replacement: "/" + base + ".min.css?v=" + VERSION,
    });
  });

  // JS: main.js → main.min.js?v=xxx
  CONFIG.js.src.forEach(function (filePath) {
    const base = path.basename(filePath, ".js");
    replacements.push({
      pattern: new RegExp(
        "/" + escapeRegex(base) + '(\\.min)?\\.js(\\?v=[^"\'\\s]*)?',
        "g"
      ),
      replacement: "/" + base + ".min.js?v=" + VERSION,
    });
  });

  let stream = src(CONFIG.html.all, { base: "." });

  // 应用文件名替换（源文件名 → 压缩文件名 + 版本号）
  replacements.forEach(function (r) {
    stream = stream.pipe(replace(r.pattern, r.replacement));
  });

  // CDN 替换：将相对 static/ 路径替换为 CDN 绝对路径
  if (CDN_URL) {
    // 匹配 ../static/ 或 ../../static/ 等相对路径
    stream = stream.pipe(
      replace(/((?:\.\.\/)+)static\//g, CDN_URL + "static/")
    );
  }

  return stream.pipe(dest(DIST));
}

// ==================== 组合任务 ====================

const build = series(
  clean,
  parallel(buildCss, buildJs, copyStatic, copyMisc),
  processHtml
);

exports.clean = clean;
exports.css = buildCss;
exports.js = buildJs;
exports.build = build;
exports.default = build;
