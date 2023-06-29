const path = require("path");

module.exports = {
  mode: "production",

  output: {
    filename: "[name].[contenthash:8].js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
  },
};
