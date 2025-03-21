const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: "/",
    },
    port: "8080", // 默认是 8080
    hot: true,
    open: true,
    compress: true, // 是否启用 gzip 压缩
    headers: { "Access-Control-Allow-Origin": "*" },
    proxy: {
      '/api': {
        target: '',
        changeOrigin: true,
        // pathRewrite: {
        //   '/api': '',
        // },
      },
    },
    client: {
      progress: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
});
