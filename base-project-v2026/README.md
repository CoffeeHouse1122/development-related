# Base Project — 传统静态页面基础框架

> 适用于落地页（Landing Page）、H5 活动页、简易官网等传统 HTML + CSS + JS 项目的快速搭建模板。

---

## 目录

- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [适配方案](#适配方案)
- [CSS 架构](#css-架构)
- [JS 模块说明](#js-模块说明)
- [构建与部署](#构建与部署)
- [多语言支持](#多语言支持)
- [代理配置](#代理配置)
- [SEO 与社交分享](#seo-与社交分享)
- [开发约定](#开发约定)
- [优化建议](#优化建议)

---

## 项目结构

### 源码结构（开发目录）

```
base-project/
├── index.html              # 根入口（设备检测 → pc/ 或 m/）
├── pc/                     # PC 端页面
│   ├── index.html          #   默认语言入口
│   ├── en/index.html       #   英文
│   ├── jp/index.html       #   日文
│   ├── kr/index.html       #   韩文
│   └── tc/index.html       #   繁体中文
├── m/                      # 移动端页面（结构同 pc/）
│   ├── index.html
│   ├── en/index.html
│   ├── jp/index.html
│   ├── kr/index.html
│   └── tc/index.html
├── static/                 # 静态资源目录（PC / 移动端共用）
│   ├── css/
│   │   ├── base.css              # 全局基础样式 & CSS Reset
│   │   ├── main.css              # PC 端主样式（开发源文件）
│   │   ├── m-main.css            # 移动端主样式（开发源文件）
│   │   ├── animate.min.css       # CSS 动画库 (Animate.css)
│   │   ├── normalize.min.css     # Normalize.css
│   │   └── swiper-bundle.min.css # Swiper 轮播组件样式
│   ├── js/
│   │   ├── jquery.min.js         # jQuery
│   │   ├── swiper-bundle.min.js  # Swiper 轮播组件
│   │   ├── gsap.min.js           # GSAP 动画引擎
│   │   ├── resize.js             # 响应式适配脚本（开发源文件）
│   │   ├── auto-lang-redirect.js # 多语言自动重定向（按需启用）
│   │   ├── main.js               # PC 端主逻辑入口（开发源文件）
│   │   └── m-main.js             # 移动端主逻辑入口（开发源文件）
│   ├── font/                     # 自定义字体文件 (woff2/woff)
│   ├── images/                   # 图片资源
│   └── media/                    # 视频/音频等媒体资源
├── gulpfile.js             # Gulp 构建脚本
├── package.json            # 项目依赖配置
├── proxy.conf.json         # 本地开发代理配置
└── favicon.ico             # 网站图标
```

### 构建产物（dist/ 目录，可直接部署）

```
dist/
├── index.html              # 根入口（设备检测跳转）
├── pc/                     # PC 端（引用已替换为 .min + 版本号）
│   ├── index.html
│   ├── en/index.html
│   ├── jp/index.html
│   ├── kr/index.html
│   └── tc/index.html
├── m/                      # 移动端
│   ├── index.html
│   ├── en/index.html
│   ├── jp/index.html
│   ├── kr/index.html
│   └── tc/index.html
├── static/                 # 静态资源
│   ├── css/                #   vendor CSS + main.min.css + m-main.min.css
│   ├── js/                 #   vendor JS + main.min.js + m-main.min.js + resize.min.js
│   ├── font/
│   ├── images/
│   └── media/
└── favicon.ico
```

---

## 技术栈

| 类别     | 技术 / 库              | 用途                       |
| ------  | --------------------- | ------------------------- |
| 基础     | HTML5 + CSS3 + ES5/6  | 页面结构、样式、交互         |
| DOM 操作 | jQuery                | DOM 查询与事件处理           |
| 轮播     | Swiper                | 轮播图 / 滑动组件           |
| 动画     | GSAP                  | 高性能动画                  |
| CSS 动画 | Animate.css           | 预设 CSS 过渡动画           |
| 适配     | rem + CSS calc + JS   | PC / 移动端响应式适配        |
| 规范     | Normalize.css         | 跨浏览器样式一致性           |
| 构建     | Gulp + Webpack + Babel | CSS/JS 压缩兼容 + 部署输出  |

---

## 快速开始

### 1. 本地开发

项目为纯静态文件，开发阶段无需构建。提供以下两种启动方式：

#### 方式一：http-server（简单快速，无热更新）

```bash
# 安装（已有可跳过）
npm install -g http-server

# 启动本地服务（带代理转发）
http-server -o -c-1 --proxy https://xxx.com
```

| 参数 | 说明 |
| --- | --- |
| `-o` | 自动打开浏览器 |
| `-c-1` | 禁用缓存（注意是 `-c-1` 不是 `-c`，`-c` 不带值会使用默认 3600 秒缓存） |
| `--proxy` | 将未匹配的请求代理到目标服务器（解决接口跨域） |

#### 方式二：browser-sync（推荐，支持热更新）

```bash
# 安装（已有可跳过）
npm install -g browser-sync

# 启动本地服务（监听文件变化自动刷新，使用局域网 IP 打开）
browser-sync start --server --port 8080 --files "**/*.html, static/**/*.css, static/**/*.js" --no-notify --open external
```

如果需要同时代理后端接口：

```bash
browser-sync start --proxy "http://xxx.com" --serveStatic "." --port 8080 --files "**/*.html, static/**/*.css, static/**/*.js" --no-notify --open external 
```

> 注意：无论 `--proxy` 目标是否为 HTTPS，browser-sync 本地服务地址始终为 **HTTP**（如 `http://10.0.15.82:8080`）。

| 参数 | 说明 |
| --- | --- |
| `--server` | 以当前目录作为静态服务根目录 |
| `--files` | 监听的文件 glob，变化时自动刷新浏览器 |
| `--proxy` | 代理目标服务器，同时注入热更新脚本 |
| `--port 8080` | 指定服务端口（默认 3000） |
| `--serveStatic "."` | 配合 proxy 模式，优先使用本地静态文件 |
| `--no-notify` | 关闭右上角 "Connected to BrowserSync" 提示 |
| `--open external` | 启动后使用局域网 IP 地址打开浏览器（方便手机调试） |

### 2. 构建部署

上线前执行构建命令，输出可直接部署的完整项目到 `dist/` 目录，详见 [构建与部署](#构建与部署)。

### 3. 部署

将 `dist/` 目录上传至静态服务器（CDN / Nginx / 对象存储）即可。`dist/` 包含完整的 HTML、压缩后的 CSS/JS 以及所有静态资源，可直接运行。

---

## 适配方案

项目提供**两种适配方案**，根据需求选择其一：

### 方案一：纯 CSS calc 适配（main.css 内置）

通过 CSS `calc()` 将根元素 `font-size` 与视口宽度挂钩，页面元素以 `rem` 为单位编写：

```css
/* PC 端 main.css */
html {
  font-size: calc(100vw / 2560 * 100);    /* 设计稿宽度 2560px → 1rem = 100px */
}

@media only screen and (max-width: 1600px) {
  html {
    font-size: 62.5px;                     /* 1600px 以下固定最小值 */
  }
}

/* 移动端 m-main.css */
html {
  font-size: calc(100vw / 750 * 100);     /* 设计稿宽度 750px → 1rem = 100px */
}
```

- **PC 端设计稿基准**：2560 × 1440
- **移动端设计稿基准**：750 × 1334
- **换算规则**：设计稿上 `100px` = `1rem`
- **PC 最小宽度**：`min-width: 1200px`，防止过窄时布局坍塌

### 方案二：JS 动态适配（resize.js）

通过 JS 实时计算缩放比，同时处理 PC 和移动端：

| 端       | 设计稿基准       | 逻辑                                          |
| ------- | ------------- | -------------------------------------------- |
| PC 桌面端 | 2560 × 1440   | 按宽高比与设计比对比，取较小方向缩放；最小缩放比 0.625 |
| 移动端    | 750 × 1334    | 同理按宽高比缩放                                |

核心输出：
- `html { font-size: <动态值>px }`：用于 `rem` 计算
- `--ratio` CSS 变量：可在 CSS 中通过 `var(--ratio)` 使用缩放比
- `--vh` CSS 变量：解决移动端 `100vh` 不准确的问题（地址栏收缩）

```html
<!-- 在 body 底部引入 resize.js（移动端页面已默认引入） -->
<script src="../static/js/resize.js"></script>
```

> **选择建议**：简单页面用方案一即可；需要精确控制宽高比、或需要同时支持横竖屏的复杂活动页建议用方案二。

---

## CSS 架构

CSS 文件按层级加载，顺序不可调换：

### PC 端加载顺序

```
base.css              → 全局基础样式 & CSS Reset
swiper-bundle.min.css → Swiper 组件样式（按需）
animate.min.css       → Animate.css 动画类（按需）
main.css              → PC 端项目主样式
```

### 移动端加载顺序

```
base.css              → 全局基础样式 & CSS Reset
swiper-bundle.min.css → Swiper 组件样式（按需）
animate.min.css       → Animate.css 动画类（按需）
m-main.css            → 移动端项目主样式
```

### base.css 全局重置要点

| 规则                                  | 说明                                 |
| ------------------------------------ | ----------------------------------- |
| `*, *::before, *::after { box-sizing: border-box }` | 统一盒模型               |
| `img/video/canvas { display: block; max-width: 100% }` | 媒体元素防溢出          |
| `input, button, textarea { font: inherit }` | 表单控件继承字体               |
| `-webkit-tap-highlight-color: transparent` | 移除移动端点击蓝色高亮         |
| `*:not(input):not(textarea) { user-select: none }` | 禁止非输入元素文本选择    |
| `touch-action: pan-x pan-y`          | 移动端禁止双指缩放                    |

### 工具类

| 类名        | 用途                           |
| ---------- | ----------------------------- |
| `.img_100` | 图片撑满容器，禁止选中            |
| `.btn`     | 透明无边框按钮基础样式            |
| `.disable` | 禁用态：灰度 + 禁止点击          |

### 自定义字体

在 `main.css` / `m-main.css` 中通过 `@font-face` 引入，字体文件放置在 `static/font/` 目录下：

```css
@font-face {
  font-family: "Roboto-Regular";
  src: url(../font/Roboto-Regular.woff2) format("woff2"),
       url('../font/Roboto-Regular.woff') format('woff');
  font-display: swap;   /* 字体加载期间显示后备字体 */
}
```

---

## JS 模块说明

### main.js

PC 端主逻辑入口文件，在此编写 PC 端页面业务代码。

### m-main.js

移动端主逻辑入口文件，在此编写移动端页面业务代码。

### resize.js

响应式适配脚本（移动端页面默认引入），详见 [适配方案 - 方案二](#方案二js-动态适配resizejs)。

### auto-lang-redirect.js

多语言自动重定向脚本（默认注释未启用），详见 [多语言支持](#多语言支持)。

---

## 构建与部署

项目集成了 Gulp 构建流程，将源码编译、压缩、资源复制后输出到 `dist/` 目录，**`dist/` 是可以直接复制到线上的完整项目**。

### 安装依赖

```bash
# 全局安装 gulp-cli（已有可跳过）
npm install -g gulp-cli

# 安装项目依赖
npm install
```

### 构建命令

```bash
npm run build          # 完整构建：输出到 dist/
npm run build:css      # 仅构建 CSS
npm run build:js       # 仅构建 JS
npm run clean          # 清理 dist 目录
```

### 构建流程

```
npm run build
  │
  ├─ 1. clean         清理 dist/ 目录
  │
  ├─ 2. 并行执行
  │     ├─ buildCss    autoprefixer + clean-css → dist/static/css/*.min.css
  │     ├─ buildJs     babel + webpack + uglify → dist/static/js/*.min.js
  │     ├─ copyStatic  复制 vendor CSS/JS、字体、图片、媒体 → dist/static/
  │     └─ copyMisc    复制 favicon.ico → dist/
  │
  └─ 3. processHtml   替换文件引用为 .min + 版本号（+ CDN）→ dist/
```

| 步骤 | CSS 处理 | JS 处理 |
|---|---|---|
| 1. 兼容 | autoprefixer 自动添加浏览器前缀 | Babel 转译 ES6+ → ES5 |
| 2. 打包 | — | webpack 打包 |
| 3. 压缩 | clean-css 压缩 | uglify 压缩 + 变量混淆 |
| 4. 输出 | `main.css` → `dist/static/css/main.min.css` | `main.js` → `dist/static/js/main.min.js` |
|        | `m-main.css` → `dist/static/css/m-main.min.css` | `m-main.js` → `dist/static/js/m-main.min.js` |
|        |  | `resize.js` → `dist/static/js/resize.min.js` |
| 5. HTML | 所有 HTML 中的引用自动替换为 `.min` 文件并追加版本号 ||

### 版本号规则

构建时自动生成时间戳版本号（格式 `YYYYMMDDHHmm`），追加到文件引用后：

```html
<!-- 构建前（源码） -->
<link rel="stylesheet" href="../static/css/main.css" />
<script src="../static/js/main.js"></script>

<!-- 构建后（dist/） -->
<link rel="stylesheet" href="../static/css/main.min.css?v=202602261430" />
<script src="../static/js/main.min.js?v=202602261430"></script>
```

### CDN 支持

通过环境变量 `CDN_URL` 可将 HTML 中所有 `static/` 相对路径替换为 CDN 绝对路径：

```bash
# Windows PowerShell
$env:CDN_URL="https://cdn.example.com/project/"; npm run build

# Linux / Mac
CDN_URL=https://cdn.example.com/project/ npm run build
```

CDN 模式下的替换效果：

```html
<!-- 不使用 CDN（默认） -->
<link rel="stylesheet" href="../static/css/main.min.css?v=202602261430" />
<script src="../static/js/jquery.min.js"></script>

<!-- 使用 CDN -->
<link rel="stylesheet" href="https://cdn.example.com/project/static/css/main.min.css?v=202602261430" />
<script src="https://cdn.example.com/project/static/js/jquery.min.js"></script>
```

> **注意**：`CDN_URL` 末尾需带 `/`。不设置该变量时构建产物使用相对路径，同样可正常运行。

### 自定义处理文件

在 `gulpfile.js` 顶部 `CONFIG` 中配置需要处理的文件：

```js
const CONFIG = {
  css: {
    src: ["static/css/main.css", "static/css/m-main.css"],
  },
  js: {
    src: ["static/js/main.js", "static/js/m-main.js", "static/js/resize.js"],
  },
};
```

> **注意**：第三方库（jquery.min.js、swiper-bundle.min.js 等）已经是压缩版本，不需要也不应该加入构建流程。只处理自己编写的源文件。

---

## 多语言支持

### 多语言目录结构

PC 端和移动端各有独立的多语言子目录：

| 语言     | PC 端              | 移动端              |
| ------- | ------------------ | ------------------ |
| 默认     | `pc/index.html`    | `m/index.html`     |
| 英文     | `pc/en/index.html` | `m/en/index.html`  |
| 日文     | `pc/jp/index.html` | `m/jp/index.html`  |
| 韩文     | `pc/kr/index.html` | `m/kr/index.html`  |
| 繁体中文  | `pc/tc/index.html` | `m/tc/index.html`  |

### auto-lang-redirect.js

`auto-lang-redirect.js` 用于根据浏览器语言自动跳转至对应语言子目录。

### 启用方式

取消 `pc/index.html` 或 `m/index.html` 中的注释：

```html
<script src="../static/js/auto-lang-redirect.js"></script>
```

### 配置项

在脚本顶部 `CONFIG` 对象中修改：

```js
const CONFIG = {
  BASE_PATH: '/pre/',        // 基础路径前缀
  DEFAULT_LANG: 'en',        // 默认语言
  MOBILE_TAG: 'm',           // 移动端路径标识
  MAX_REDIRECT: 2,           // 最大重定向次数（防循环）
  SUPPORTED_LANGS: {         // 支持的语言 → 浏览器语言代码映射
    en: ['en', 'en-us', 'en-gb'],
    tw: ['zh-tw', 'zh-hant', 'zh-hk'],
    th: ['th', 'th-th']
  }
};
```

---

## 代理配置

`proxy.conf.json` 用于本地开发时的接口代理转发（需配合支持该配置的本地服务器使用）：

```json
{
  "/xxx": {
    "target": "https://xxx.com",
    "changeOrigin": true
  }
}
```

也可直接使用 `http-server` 的 `--proxy` 参数：

```bash
http-server -o -c-1 --proxy https://xxx.com
```

---

## SEO 与社交分享

`index.html` 及各语言页面已预留 Open Graph 元标签，用于 Facebook / Twitter 等平台分享时的信息展示：

```html
<meta property="og:title" content="页面标题" />
<meta property="og:description" content="页面描述" />
<meta property="og:url" content="页面地址" />
<meta property="og:image" content="分享缩略图 URL" />
```

同时需填写：

```html
<title>页面标题</title>
<meta name="keywords" content="关键词1,关键词2" />
<meta name="description" content="页面描述" />
```

---

## 开发约定

### PC / 移动端分离

- 根入口 `index.html`：UA 检测，自动跳转到 `pc/` 或 `m/`
- PC 端入口：`pc/index.html`
- 移动端入口：`m/index.html`
- PC 端各语言页面内含 UA 检测，移动端访问时自动跳转到对应 `m/` 子目录

```js
// 根 index.html — 设备分流
var isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
location.href = isMobile ? "./m/index.html" : "./pc/index.html";

// pc/en/index.html — 移动端访问时跳转到对应 m/ 目录
if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
  location.href = "../../m/en/index.html";
}
```

### 文件职责

| 文件 | 用途 |
| --- | --- |
| `main.css` | PC 端样式（适配基准 2560px） |
| `m-main.css` | 移动端样式（适配基准 750px） |
| `main.js` | PC 端业务逻辑 |
| `m-main.js` | 移动端业务逻辑 |
| `resize.js` | 响应式适配（移动端默认引入） |

### 尺寸单位

- 使用 `rem` 作为主要单位，配合适配方案自动缩放
- PC 端设计稿基准：**2560 × 1440**，`1rem = 100px`
- 移动端设计稿基准：**750 × 1334**，`1rem = 100px`
- 示例：设计稿上 `240px` 宽度 → 写为 `2.4rem`

### 图片资源

- 放置在 `static/images/` 目录下
- 作为容器背景或使用 `<img class="img_100">` 撑满父容器
- 建议根据设备和分辨率准备多套图片

### 字体文件

- 放置在 `static/font/` 目录下
- 推荐格式：`woff2`（优先）+ `woff`（兼容）
- 在 `main.css` / `m-main.css` 中通过 `@font-face` 声明

---

## 优化建议

> 以下为可选优化方向，未直接集成到项目中，按需采纳。

1. **按需加载第三方库**：当前默认引入了 jQuery、Swiper、GSAP、Animate.css，若页面未使用其中某些库，建议移除对应的 CSS / JS 引用以减小体积。

2. **图片优化**：
   - 使用 WebP / AVIF 格式替代 PNG/JPG，搭配 `<picture>` 标签做格式降级
   - 首屏以外的图片使用懒加载（`loading="lazy"` 或 JS 方案）
   - 考虑使用雪碧图或 SVG Sprite 合并小图标

3. **预加载关键资源**：
   ```html
   <link rel="preload" href="../static/font/Roboto-Regular.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="preload" href="../static/images/hero-banner.webp" as="image">
   ```

4. **引入 CSS 预处理器**：如项目样式较复杂，可考虑使用 SCSS/Less + 简单的编译脚本提升开发效率。

5. **Linting 与格式化**：引入 ESLint / Prettier 统一代码风格，即使在传统项目中也能提升可维护性。
