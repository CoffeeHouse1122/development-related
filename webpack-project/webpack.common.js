const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    index: {
      import: "./src/js/main.js",
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
    clean: true,
    filename: "js/[name].[contenthash].bundle.js",
    assetModuleFilename: "[name][ext]",
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|apng|ico)$/i,
        type: "asset/resource",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64
          },
        },
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
        type: "asset/resource",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64
          },
        },
        generator: {
          filename: "media/[hash][ext][query]",
        },
      },
      {
        test: /\.json$/,
        type: "asset/resource",
        generator: {
          filename: "json/[name].[hash][ext][query]",
        },
      },
    ],
  },
  optimization: {
    usedExports: true, // 模块只导出被使用的成员
    moduleIds: "deterministic", // 内容变化 hash变化
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all", // 提取公共模块
        },
      },
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./src/lib",
          to: "lib",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inject: "body",
      minify: false,
      chunks: ["index"],
    }),
  ],
};
