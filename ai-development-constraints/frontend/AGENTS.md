# 前端项目开发约束

## 1. 使用原则

- 本文件放在项目根目录，适用于前端项目的创建、开发、审查和维护。
- 用户明确要求优先于本文件；已有项目优先遵循现有技术栈和目录，不擅自迁移框架。
- 信息不足且会影响架构时，必须先询问，不得猜测。主要包括：JavaScript/TypeScript、UI 组件库、字体、动画方案、部署路径和浏览器兼容范围。
- 只修改当前任务需要的文件，不顺手重构无关代码，不覆盖用户已有改动。
- 分析或审查任务默认只读；用户未要求修复时不得修改代码。

## 2. 默认技术方向

- 前端默认使用 Vue 3、Vite、axios、Composition API 和 ESM。
- 包管理默认使用 npm，并提交 `package-lock.json`；不得混用其他包管理器。
- JavaScript/TypeScript 尚未确定时先询问，不自行选择。
- 项目已有 UI、图标、字体和动画体系时继续沿用，不重复引入第二套方案。
- 新项目的图标默认优先考虑 Remix Icon；其他视觉选项未确认时先询问。

### 2.1 统一 Vite 配置

新建 Vue 项目必须使用同一套 Vite 基线，不得随项目随意改名或删减：

- 使用 `defineConfig`、`loadEnv`、Vue plugin；`@` 固定指向 `src`。
- `base`：开发环境固定 `./`；生产环境读取 `VITE_CDN_BASE`，未配置时回退 `./`。
- dev server：`host: "0.0.0.0"`、`port: 5173`、`strictPort: true`、`open: true`、HMR overlay 开启；禁止将 `allowedHosts` 设为 `true`。
- API 代理：`/api`、`/media` 指向 `VITE_API_PROXY_TARGET`，默认 `http://localhost:3000`。
- build：`outDir: "dist"`、`assetsDir: "assets"`、`assetsInlineLimit: 4096`、`minify: "esbuild"`、`chunkSizeWarningLimit: 1000`。
- 生产环境关闭 sourcemap，并移除 `console`、`debugger`；开发环境保留 sourcemap。
- 输出统一为 `static/js/[name]-[hash].js`、`static/css/[name]-[hash].css`、`static/images/[name]-[hash][extname]`，其他资源进入 `static/[ext]/`。
- 旧浏览器兼容由 `VITE_LEGACY=true` 显式开启，默认不加载 legacy plugin。
- 项目确需偏离基线时，必须在 Vite 配置旁注释原因，并更新 README。

### 2.2 统一命令

所有前端项目统一使用以下命令名，不得用 `serve`、`watch` 等名称替代：

- 开发与构建：`dev`、`build`、`preview`。
- 质量检查：`lint`、`test`、`check`；TypeScript 或启用 checkJs 时提供 `typecheck`。
- `check` 依次执行适用的 lint、typecheck、test、build。
- 可以增加业务命令，但不得用空脚本或固定成功输出来伪造统一命令。

## 3. 新项目初始化

创建项目前先确认：产品目标、目标用户、运行平台、部署方式、技术选项和第一阶段功能范围。

默认目录如下，只创建实际需要的目录，不生成无用示例页和占位代码：

```text
public/                    原样复制的公共资源
src/
  api/                     axios 实例和按业务拆分的接口
  assets/                  参与构建的图片、字体等资源
  components/
    base/                  无业务含义的基础组件
    business/              可复用业务组件
  composables/             可复用状态和交互逻辑
  layouts/                 页面布局
  router/                  路由配置，确有多页面时创建
  stores/                  跨页面状态，确有需要时创建
  styles/                  token、主题和全局样式
  types/                   TypeScript 类型，使用 TS 时创建
  utils/                   无副作用的通用函数
  views/                   路由页面
  App.vue
  main.js|ts
tests/                     自动化测试
docs/                      架构或复杂功能说明
.env.example
.gitignore
README.md
package.json
vite.config.js|ts
```

初始化完成后必须提供可运行的最小骨架、环境变量示例、统一请求层、基础样式、验证脚本和 README。不得留下模板名称、虚假数据或无效脚本。

## 4. 架构边界

- `views` 负责页面编排，不集中承载全部业务逻辑。
- `components/base` 不访问业务 API；`components/business` 只处理自身业务范围。
- `composables` 封装可复用状态和副作用；`utils` 保持无状态、无副作用。
- API 调用统一放在 `api`，组件内禁止散落裸 `fetch` 或直接创建 axios 实例。
- `App.vue` 只承担应用入口和顶层布局，不堆积具体页面业务。
- 发现文件职责过多或明显过大时，先给出拆分方案；具体行数阈值未确认前不得自行制定。
- 不为追求形式创建过度抽象；同一逻辑出现明确复用需求后再抽取。

## 5. 界面与交互

- 使用统一设计 token 管理颜色、间距、字体、圆角、阴影和层级，避免页面内重复硬编码。
- 禁止使用浏览器原生 `alert`、`confirm`、`prompt`；使用统一弹窗或内联确认。
- 自定义下拉必须支持键盘、焦点和可访问性；是否全面禁止原生 `select` 尚未确认时先询问。
- 所有功能覆盖 loading、empty、error、disabled/no-permission 状态。
- 按钮和可交互元素必须有 hover、focus、disabled 和 loading 反馈。
- 不捏造生产数据、指标和 AI 结论；Mock 数据必须明确标记且仅用于开发或测试。
- `v-html`/`dangerouslySetInnerHTML` 只能渲染可信静态内容；外部或用户内容未经可靠净化禁止注入。
- 响应式页面至少验证目标桌面宽度和一个窄屏宽度。

## 6. 请求、状态与环境配置

- 使用封装后的 axios request 实例，统一处理 base URL、认证、超时、错误和 request ID。
- API 地址、部署 base、功能开关放入环境配置，不在组件中硬编码。
- 前端环境变量全部视为公开信息，禁止保存密码、token、私钥和服务端 secret。
- 提交无秘密的 `.env.example`；每个变量写明用途、是否必填和示例值。
- 认证与权限由统一层管理；业务组件不自行实现另一套登录或 token 刷新逻辑。
- 跨页面状态才进入 store；页面局部状态留在页面或 composable 中。

## 7. 代码与测试

- 注释说明业务原因、边界和重要决策，不逐行翻译代码；注释语言未确认时跟随当前项目。
- 命名表达业务含义，禁止无意义的 `data1`、`temp2`、`handleThing`。
- 不吞异常，不用禁用规则、删除测试或滥用 `any` 让检查通过。
- bug 修复必须补回归测试；计算、解析、权限判断和数据转换等核心逻辑必须有单元测试。
- 项目提供适用的 `lint`、`typecheck`、`test`、`build` 和统一 `check` 脚本。
- 交付前执行与改动相关的检查；未执行的检查及原因必须明确说明。

## 8. 文档、Git 与交付

- README 至少包含项目目的、环境要求、配置、启动、构建和验证命令。
- public API、目录架构、部署方式或关键交互发生变化时同步更新文档。
- 不提交 `node_modules`、构建产物、缓存、日志、真实 `.env` 和临时文件。
- Git 自动 init/commit 策略尚未确认；用户未明确时不执行 `git init`、commit 或 push。
- 最终回复必须说明完成内容、修改文件、实际验证、未验证项、假设和剩余风险。
