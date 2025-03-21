import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import legacy from "@vitejs/plugin-legacy";
import autoprefixer from "autoprefixer";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  // 公共路径
  base: "./",

  // 开发环境
  server: {
    host: "0.0.0.0", // 监听地址，'0.0.0.0' 允许局域网访问
    port: 5173, // 服务端口
    open: true, // 是否自动在浏览器中打开
    // 可以设置代理
    // proxy: {
    // '/api': {
    //   target: '',
    //   changeOrigin: true,
    //   rewrite: path => path.replace(/^\/api/, '')
    // }
    // }
  },

  // 插件
  plugins: [
    vue(),
    visualizer({
      open: false, //在默认用户代理中打开生成的文件
      gzipSize: true, // 收集 gzip 大小并将其显示
      brotliSize: true, // 收集 brotli 大小并将其显示
    }),
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
  ],

  // 解析
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  // css处理
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          // 自动添加前缀，指定browsers浏览器版本
          overrideBrowserslist: [
            "Android 4.1",
            "iOS 7.1",
            "Chrome > 31",
            "ff > 31",
            "ie >= 8",
            "last 2 versions", // 所有主流浏览器最近2个版本
          ],
          grid: true,
        }),
      ],
    },
  },


  // 打包
  build: {
    outDir: "dist",
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
    // 静态资源打包到dist下的不同目录
    rollupOptions: {
      output: {
        // 最小化拆分包
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 通过拆分包的方式将所有来自node_modules的模块打包到单独的chunk中
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});
