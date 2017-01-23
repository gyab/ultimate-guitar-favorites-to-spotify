var path = require("path");

module.exports = {
  entry: {
    app: ["./app/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.js"
  },
  devServer: {
  	contentBase: "./build",
  	host: "127.0.0.1"
  },
  devtool: "eval-source-map"
};