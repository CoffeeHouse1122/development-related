// Node.js 路径工具
import { fileURLToPath, URL } from "node:url";
// 旧浏览器兼容插件（按需启用）
import legacy from "@vitejs/plugin-legacy";
// CSS 自动添加前缀
import autoprefixer from "autoprefixer";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

/**
 * 规范化 base 路径，确保以斜杠结尾
 * @param {string} base - 原始 base 路径
 * @returns {string} 规范化后的路径
 */
function normalizeBase(base) {
  if (!base) return "./";
  if (base === "./" || base === "/") return base;
  return base.endsWith("/") ? base : `${base}/`;
}

export default defineConfig(({ mode }) => {
  // 加载环境变量（包含 .env 文件中所有变量）
  const env = loadEnv(mode, process.cwd(), "");
  // 生产环境 CDN 基础路径
  const cdnBase = normalizeBase(env.VITE_CDN_BASE);
  const isProduction = mode === "production";

  // 通过环境变量 VITE_LEGACY 控制是否启用旧浏览器兼容插件
  const enableLegacy = env.VITE_LEGACY === "true";

  // 动态组装插件列表
  const plugins = [vue()];
  if (enableLegacy) {
    plugins.push(
      legacy({
        targets: [
          "last 2 versions",
          "iOS >= 10",
          "Android >= 5",
          "Chrome >= 49",
          "Safari >= 10",
          "Firefox >= 54",
          "Opera >= 38",
          "Samsung >= 5",
          "OperaMobile >= 46",
          "not IE <= 11",
        ],
      }),
    );
  }

  return {
    // 公共基础路径：生产环境使用 CDN 路径，开发环境使用相对路径
    base: isProduction ? cdnBase : "./",

    plugins,

    // 路径别名配置
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    // 开发服务器配置
    server: {
      host: "0.0.0.0",       // 允许局域网访问
      port: 5173,
      open: true,            // 自动打开浏览器
      hmr: {
        overlay: true,       // 报错时显示遮罩
      },
      // API 代理，解决开发环境跨域问题
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:3000",
          changeOrigin: true,
          // 如果后端接口不带 /api 前缀，可取消注释 rewrite 选项
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/media": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:3000",
          changeOrigin: true,
        },
      },
      // HTTPS 支持（默认关闭，可根据需要开启）
      https: false,
      // 自定义 HTTPS 证书示例：
      // https: {
      //   key: fs.readFileSync('./localhost-key.pem'),
      //   cert: fs.readFileSync('./localhost.pem'),
      // },
    },

    // CSS 相关配置
    css: {
      devSourcemap: true,   // 开发环境生成 CSS sourcemap
      // 仅在生产环境启用 PostCSS 和 autoprefixer，提升开发构建速度
      postcss: isProduction
        ? {
            plugins: [
              autoprefixer({
                overrideBrowserslist: [
                  "Android 4.1",
                  "iOS 7.1",
                  "Chrome > 31",
                  "ff > 31",
                  "last 2 versions",
                ],
                grid: true,   // 支持 CSS Grid 布局的兼容处理
              }),
            ],
          }
        : undefined,
    },

    // 构建配置
    build: {
      outDir: "dist",                // 输出目录
      assetsDir: "assets",           // 静态资源子目录
      assetsInlineLimit: 4096,       // 小于 4KB 的资源内联为 base64
      minify: "esbuild",             // 使用 esbuild 进行压缩（速度快）
      sourcemap: !isProduction,      // 生产环境不生成 sourcemap
      reportCompressedSize: false,   // 不报告压缩后大小（加快构建）
      cssCodeSplit: true,            // CSS 代码分割
      chunkSizeWarningLimit: 1000,   // 超过 1MB 时给出警告

      // esbuild 配置：生产环境删除 console 和 debugger
      esbuild: {
        drop: isProduction ? ["console", "debugger"] : [],
      },

      rollupOptions: {
        output: {
          // 分包策略：分离第三方库和业务代码，优化缓存
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              // Vue 生态相关库单独打包
              if (id.includes("vue") || id.includes("pinia") || id.includes("vue-router")) {
                return "vue-vendor";
              }
              if (id.includes("axios")) {
                return "axios";
              }
              // 其余第三方库打包为 vendor
              return "vendor";
            }
            if (id.includes("/src/")) {
              return "app";
            }
            return undefined;
          },
          // 输出文件命名规则（带 hash，避免缓存问题）
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            // 图片资源放入 static/images
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
              return "static/images/[name]-[hash][extname]";
            }
            // CSS 资源放入 static/css
            if (/\.css$/i.test(assetInfo.name)) {
              return "static/css/[name]-[hash][extname]";
            }
            // 其他资源放入 static/[ext]
            return "static/[ext]/[name]-[hash][extname]";
          },
        },
      },
    },
  };
});