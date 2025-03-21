const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  // devtool: 'hidden-source-map',
  output: {
    publicPath: '//cdnstatic.herogame.com/static/',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        // exclude: /(node_modules|bower_components)/,
        // include: path.resolve(__dirname, "src"),
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [ "autoprefixer"],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage", // "entry" = @babel/polyfill
                  corejs: { version: 3, proposals: true },
                },
              ],
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              ["@babel/plugin-proposal-class-properties", { loose: true }],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      linkType: "text/css",
    }),
  ],
  optimization: {
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
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin(),
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
        minify: CssMinimizerPlugin.cssnanoMinify,
      }),
    ],
  },
});
