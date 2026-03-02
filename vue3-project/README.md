# vue3-project

Vue3 中小型项目基础框架，适用于落地页、H5 活动、官网等场景。

## 已内置能力

- Vue3 + Vite
- Hash 路由（后端无需 history 回退支持）
- Pinia 状态管理
- vue-i18n 多语言
- 双端布局骨架（Desktop / Mobile）
- API 请求层封装
- 统一埋点出口（tracker）
- 构建分包策略优化（避免包名碎片化过多）

## 目录结构

```text
.
├─ .env.development                # 开发环境变量
├─ .env.production                 # 生产环境变量（含 CDN 前缀）
├─ index.html                      # Vite HTML 入口模板
├─ jsconfig.json                   # 路径别名与 JS 配置
├─ package.json                    # 项目依赖与 npm scripts
├─ vite.config.js                  # Vite 构建与分包配置
├─ scripts/
│  └─ init-project.mjs            # 新项目初始化脚本
├─ public/                        # 公共静态资源（不参与构建哈希）
└─ src/
   ├─ main.js                     # 应用入口（注册 pinia/router/i18n）
   ├─ App.vue                     # 根组件（布局切换 + 路由出口）
   ├─ apis/                       # 接口请求层
   │  ├─ http.js                  # fetch 请求封装（超时、query 处理）
   │  └─ index.js                 # API 模块统一导出
   ├─ assets/                     # 样式、字体等资源
   │  ├─ css/
   │  │  ├─ normalize.min.css     # 浏览器默认样式重置
   │  │  ├─ font.css              # 字体声明
   │  │  └─ base.css              # 基础样式与双端 rem 规则
   │  └─ font/
   │     └─ SourceHanSansCN-Regular.ttf # 默认中文字体文件
   ├─ layouts/                    # 页面布局容器
   │  ├─ DesktopLayout.vue        # PC 布局壳
   │  └─ MobileLayout.vue         # 移动端布局壳
   ├─ lib/                        # 第三方库本地文件
   │  └─ jsmpeg.min.js            # jsmpeg 库（按需使用）
   ├─ locales/                    # 国际化模块
   │  ├─ index.js                 # i18n 实例与语言切换方法
   │  └─ languages/
   │     ├─ zh-CN.js              # 中文文案
   │     └─ en-US.js              # 英文文案
   ├─ router/                     # 路由模块
   │  └─ index.js                 # hash 路由 + 守卫 + 页面访问埋点
   ├─ stores/                     # pinia 状态管理
   │  └─ appStore.js              # 全局状态（设备、语言、query）
   ├─ tracker/                    # 埋点模块
   │  └─ index.js                 # 统一事件/页面埋点出口
   ├─ utils/                      # 工具方法
   │  ├─ deviceDetector.js        # 设备类型识别
   │  └─ initApp.js               # 应用初始化（html class、默认语言）
   └─ views/                      # 页面视图
      ├─ HomeView.vue             # 示例首页
      └─ NotFoundView.vue         # 404 页面
```

## 启动与构建

```sh
npm install
npm run dev
npm run build
```

## 快速初始化（新活动）

```sh
npm run init:project -- name=my-h5-campaign locale=en-US tracker=true apiDev=/api apiProd=https://api.example.com cdnProd=https://cdn.example.com/my-h5-campaign/ timeout=10000
```

可选参数：

- `--name`：写入 `package.json` 项目名
- `--locale`：默认语言（如 `zh-CN` / `en-US`）
- `--tracker`：埋点开关（`true`/`false`）
- `--apiDev`：开发环境 API 地址
- `--apiProd`：生产环境 API 地址
- `--cdnProd`：生产环境静态资源 CDN 前缀（用于 Vite `base`）
- `--timeout`：请求超时毫秒数

## 环境变量

- `.env.development`
- `.env.production`

可按项目替换：

- `VITE_API_BASE_URL`
- `VITE_API_TIMEOUT`
- `VITE_DEFAULT_LOCALE`
- `VITE_TRACKER_ENABLED`
- `VITE_CDN_BASE`（生产环境静态资源 CDN 前缀）

## 目录说明（裁剪建议）

### 必须保留

- `src/main.js`、`src/App.vue`：应用入口与根组件。
- `src/router/`：统一使用 hash 路由，建议保留守卫逻辑。
- `src/stores/`：全局状态（设备类型、语言、通用参数）。
- `src/locales/`：多语言基础能力（即使首期单语也建议保留结构）。
- `src/utils/initApp.js`、`src/utils/deviceDetector.js`：初始化与双端识别。
- `vite.config.js`、`.env.*`：构建、CDN、环境变量配置核心。

### 按需保留

- `src/apis/`：有接口请求时保留；纯静态落地页可暂时精简。
- `src/tracker/`：有埋点需求时保留；无埋点可置空实现。
- `src/layouts/`：有双端差异时保留；单端活动可合并为一种布局。
- `src/lib/`：仅在使用三方库（如 `jsmpeg`）时保留。
- `scripts/init-project.mjs`：团队多人复用模板时建议保留。

### 可删除（新项目初始化后）

- `src/views/HomeView.vue`、`src/views/NotFoundView.vue`：示例页面可替换为业务页面。
- `dist/`：构建产物目录，不应作为模板内容提交。
- `stats.html`（如存在）：仅体积分包分析临时文件。

### 推荐最小目录（MVP）

```text
src/
	main.js
	App.vue
	router/
	stores/
	locales/
	utils/
	views/
```

## 新项目使用建议

1. 复制该模板目录。
2. 替换 `src/views` 与 `src/assets`。
3. 在 `src/apis` 中按活动需求添加接口。
4. 在 `src/locales/languages` 扩展文案。
5. 在 `src/router/index.js` 配置页面路由。
