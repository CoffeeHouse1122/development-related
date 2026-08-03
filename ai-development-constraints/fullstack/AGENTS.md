# 全栈项目开发约束

## 1. 使用原则

- 本文件放在项目根目录，适用于全栈项目的创建、开发、审查和维护。
- 用户明确要求优先于本文件；已有项目遵循现有技术栈和目录，不擅自迁移框架或数据库。
- 信息不足且会影响架构时必须先询问，不得猜测。主要包括：前端语言、UI 方案、数据库、认证方式、部署环境、文件存储、日志和备份策略。
- 只修改当前任务需要的文件，不覆盖用户已有改动，不处理无关项目。
- 分析或审查任务默认只读；用户未要求修复时不得修改代码。

## 2. 默认技术方向

- 前端默认使用 Vue 3、Vite、axios、Composition API 和 ESM。
- 常规小项目后端默认使用 Node.js、Express 和 REST/JSON API。
- 中大型业务项目默认推荐 TypeScript + NestJS + PostgreSQL；高并发、性能或资源占用敏感的独立服务使用 Go。项目边界不明确时先询问。
- 包管理默认使用 npm，并提交 `package-lock.json`；不得混用包管理器。
- JavaScript/TypeScript、SQLite/PostgreSQL、UI 组件库等尚未确定时先询问，不自行决定。
- 复杂平台、Electron 或 Python/AI 服务不强套普通 Web 全栈结构，应先确认对应项目画像。

### 2.1 统一 Vite 配置

Web 前端和 Electron renderer 使用同一套 Vite 基线：

- 使用 `defineConfig`、`loadEnv`、Vue plugin；`@` 固定指向前端或 renderer 的 `src`。
- `base`：开发环境固定 `./`；生产环境读取 `VITE_CDN_BASE`，未配置时回退 `./`。
- dev server：`host: "0.0.0.0"`、`port: 5173`、`strictPort: true`、HMR overlay 开启；Web 使用 `open: true`，Electron renderer 使用 `open: false`；禁止将 `allowedHosts` 设为 `true`。
- API 代理：`/api`、`/media` 指向 `VITE_API_PROXY_TARGET`，默认 `http://localhost:3000`。
- Web build：`outDir: "dist"`、`assetsDir: "assets"`、`assetsInlineLimit: 4096`、`minify: "esbuild"`、`chunkSizeWarningLimit: 1000`。
- 生产环境关闭 sourcemap，并移除 `console`、`debugger`；开发环境保留 sourcemap。
- 输出统一为 `static/js/[name]-[hash].js`、`static/css/[name]-[hash].css`、`static/images/[name]-[hash][extname]`，其他资源进入 `static/[ext]/`。
- 旧浏览器兼容由 `VITE_LEGACY=true` 显式开启，默认不加载 legacy plugin。
- Electron 使用 electron-vite 时，renderer 继续遵守上述 alias、env、sourcemap 和资源规则；renderer、main、preload 使用互相独立的输出目录。
- 项目确需偏离基线时，必须在配置旁注释原因，并更新 README。

### 2.2 统一命令

全栈 Web 项目根目录统一提供：

- 开发：`dev` 同时启动前后端；`dev:frontend`、`dev:backend` 分别启动。
- 构建：`build` 完整构建；`build:frontend`、`build:backend` 分别构建；`start` 启动生产服务。
- 检查：`lint`、`test`、`check`；适用时提供 `typecheck`。`check` 聚合所有实际检查和完整构建。

Electron 项目根目录统一提供：

- 开发：`dev` 同时启动；`dev:renderer`、`dev:electron` 分别启动。
- 构建：`build` 完整构建；`build:main`、`build:renderer` 分别构建。
- 打包：`pack` 生成目录包；`dist` 生成当前平台安装包；`dist:win` 生成 Windows 安装包。
- 检查：`lint`、`typecheck`、`test`、`check`；`check` 聚合检查和完整构建。

可以增加业务命令，但不得用空脚本、固定成功输出或仅打印提示来伪造统一命令。

## 3. 新项目初始化

创建项目前先确认：产品目标、用户与权限、部署方式、前后端运行关系、数据库、文件存储、外部服务和第一阶段范围。

默认目录如下，只创建实际需要的目录：

```text
frontend/
  public/
  src/
    api/
    assets/
    components/
      base/
      business/
    composables/
    layouts/
    router/
    stores/
    styles/
    types/
    utils/
    views/
    App.vue
    main.js|ts
  tests/
  .env.example
  package.json
  vite.config.js|ts
backend/
  src/
    config/                  配置加载与校验
    controllers/             HTTP 输入输出
    middleware/              认证、权限、日志、错误处理
    routes/                  路由注册
    services/                业务逻辑
    repositories/            数据访问
    models/                  数据模型
    jobs/                    定时和后台任务
    utils/                   无业务含义的工具
    app.js|ts                Express 应用
    server.js|ts             服务启动入口
  database/
    migrations/
    seeds/
  tests/
  .env.example
  package.json
docs/                        架构、API 和运维说明
.gitignore
AGENTS.md
README.md
package.json                 可选：统一启动和检查脚本
```

初始化完成后必须具备：前后端最小可运行骨架、健康检查 API、统一请求层、配置校验、错误处理、日志入口、数据库迁移机制、验证脚本和 README。不得生成无业务价值的示例模块或虚假数据。

## 4. Electron 桌面项目

全栈项目属于 Electron 桌面程序时，不创建普通 `frontend/backend` 骨架，改用：

```text
build/
  icons/                     打包和应用图标
docs/
src/
  electron/
    main/
      services/              文件、系统、音视频等原生能力
      utils/
      types/
    preload/                 contextBridge 白名单
  renderer/
    assets/
    components/
    pages/
    router/
    stores/
    styles/
  shared/                    main、preload、renderer 共享契约
tests/
```

- main 只负责窗口生命周期、IPC 和原生能力；renderer 不直接访问 Node.js API。
- preload 只暴露按业务命名的最小 API，禁止透传原始 `ipcRenderer`。
- 所有窗口明确设置 `contextIsolation: true`、`nodeIntegration: false`、`webSecurity: true`；sandbox 默认开启，关闭时必须记录原因和替代防护。
- IPC handler 校验 sender、payload、权限和路径范围；文件读写只允许用户选择路径或应用数据目录。
- `shell.openExternal` 校验协议和域名；限制导航、新窗口和权限请求，并配置 CSP。
- 运行数据、日志和配置写入系统 `userData`，不得写入安装目录或源码目录。
- renderer 只处理界面与状态；本地业务能力优先放 main services，确需独立 HTTP 服务时再创建 backend。
- Electron、Chromium、Node 和原生依赖作为一个整体验证；交付前至少执行 typecheck、测试、完整构建和目标平台打包。

## 5. 前端约束

- 页面、业务组件、基础组件、composable、store 和 API 层职责分离。
- API 调用统一通过封装后的 axios request 实例；组件内禁止散落裸 `fetch`、硬编码地址或重复 token 逻辑。
- 页面覆盖 loading、empty、error、disabled/no-permission 状态。
- 禁止使用原生 `alert`、`confirm`、`prompt`；自定义下拉必须满足键盘和可访问性要求。
- 使用设计 token 统一颜色、间距、字体、圆角和状态语义。
- 前端变量全部视为公开信息，禁止包含任何服务端秘密。
- `v-html`/`dangerouslySetInnerHTML` 不得渲染未经可靠净化的外部或用户内容。
- `App.vue` 和页面组件不得持续堆积全部业务；发现明显过大时先给出拆分方案。

## 6. 后端与 API

- route 只注册路由，controller 处理输入输出，service 承担业务，repository 负责数据访问。
- 路由和 controller 中禁止直接拼接 SQL 或堆积复杂业务逻辑。
- 所有 body、query、params、header、文件和外部 API 响应在边界处验证。
- API 使用一致的 JSON 成功/错误结构；错误至少包含稳定 code、message 和 request_id。
- 认证与授权分开处理；所有敏感资源在服务端校验权限。
- 外部请求设置超时、错误映射和有限重试；非幂等请求不得盲目重试。
- 后台任务明确状态、幂等、失败重试和恢复策略。
- 不吞异常，不把堆栈、SQL、secret 或内部路径直接返回给客户端。

## 7. 数据库与文件

- 数据库未确定时先询问；不得因为个人默认值替换项目已有数据库。
- schema 变更通过 migration，禁止启动时静默执行破坏性变更。
- 查询必须参数化；事务覆盖需要原子完成的多步写入。
- 核心数据包含创建和更新时间；命名、主键和软删除策略由项目确认后统一。
- 上传文件限制类型、MIME、大小和数量；服务端生成文件名并防止路径穿越。
- 上传、生成文件、数据库、备份和运行数据不得存入源码目录或提交 Git。
- 日志与备份时间、目录和保留周期尚未确认时先询问，不自行硬编码。

## 8. 日志、安全与环境配置

- 服务端日志使用结构化 JSON，至少包含 timestamp、level、event、request_id、method、path、status_code 和 duration_ms。
- access、app、error 和进程日志职责分离；敏感字段统一脱敏。
- 密码、token、cookie、authorization、secret、api key、client secret 和私钥不得进入源码、日志、响应、文档或 Git。
- 真实 `.env` 不提交；前后端分别提供 `.env.example`，每个变量写明用途、是否必填和示例值。
- 生产及承载账号、密码、token 的环境是否强制 HTTPS 尚未最终确认；未确认前不得把前端加密描述为 TLS 的替代方案。
- 文件、接口和数据库操作遵循最小权限；安全例外必须记录原因和替代防护。

## 9. 代码质量与测试

- 注释解释业务原因、边界和重要决策，不逐行翻译代码；语言未确认时跟随当前项目。
- 不用禁用规则、删除测试、空脚本或滥用 `any` 让检查通过。
- bug 修复必须补回归测试；业务计算、权限、数据转换和 repository 必须有单元测试。
- API 至少覆盖成功、参数错误、未认证/无权限和内部失败路径。
- 项目提供适用的 `lint`、`typecheck`、`test`、`build` 和统一 `check` 脚本。
- 根 `check` 应聚合前后端实际检查，并可在主开发系统运行。
- 交付前执行相关检查；未执行项和原因必须明确说明。

## 10. 文档、Git 与交付

- README 至少包含项目目的、架构、环境要求、配置、启动、构建、迁移、验证和部署方式。
- API、数据库、认证、目录架构或部署方式变化时同步更新对应文档。
- 不提交依赖目录、构建产物、安装包、缓存、日志、真实环境文件、数据库、上传和临时文件。
- Git 自动 init/commit 策略尚未确认；用户未明确时不执行 `git init`、commit 或 push。
- 最终回复必须说明完成内容、修改文件、迁移影响、实际验证、未验证项、假设和剩余风险。
