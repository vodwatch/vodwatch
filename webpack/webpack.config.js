const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');
module.exports = {
  mode: "production",
  entry: {
    content: path.resolve(__dirname, "..", "src", "content.ts"),
    background: path.resolve(__dirname, "..", "src", "background.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js", ".vue"],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
        ]
      }
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),

    new VueLoaderPlugin(),
  ],
};
