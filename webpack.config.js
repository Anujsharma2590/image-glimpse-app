const { merge } = require("webpack-merge");

// webpack configs
const commonConfig = require("./webpack/webpack.common");
const devConfig = require("./webpack/webpack.development");
const prodConfig = require("./webpack/webpack.production");

module.exports = (env, argv) => {
  const isEnvDevelopment = argv && argv.mode === "development";

  if (isEnvDevelopment) {
    return merge(commonConfig("development"), devConfig);
  } else {
    return merge(commonConfig("production"), prodConfig);
  }
};
