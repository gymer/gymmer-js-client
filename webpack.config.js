var webpack = require("webpack");

module.exports = {
  entry: "./src/bundle.js",
  output: {
    path: __dirname,
    filename: "./dist/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel", query: {presets: 'es2015'} }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  devtool: 'eval-source-map',
  devServer: {
    port: 8000
  }
};
