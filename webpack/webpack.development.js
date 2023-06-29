const path = require("path");

module.exports = {
  mode: "development",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
    port: 3000,
    host: "localhost",
    compress: true,
    open: {
      target: "https://localhost:3000",
      app: {
        name: "google-chrome",
      },
    },
  },
};
