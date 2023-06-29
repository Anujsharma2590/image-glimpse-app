const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const tsTsxJsJsxRegex = /\.(ts|tsx|js|jsx)$/;
const assetsRegx =
  /\.(png|jp(e*)g|svg|woff(2)?|ttf|eot|pdf)(\?v=\d+\.\d+\.\d+)?$/;

const cssRegex = /\.css$/;

module.exports = () => {
  return {
    entry: path.resolve(__dirname, "../src/index.tsx"),

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css"],
    },
    module: {
      rules: [
        {
          test: tsTsxJsJsxRegex,
          exclude: /node_modules/,
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
        {
          test: cssRegex,
          use: [
            {
              loader: "style-loader",
            },
            { loader: "css-loader" },
          ],
        },

        {
          test: assetsRegx,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../public/index.html"),
      }),
    ],
  };
};
