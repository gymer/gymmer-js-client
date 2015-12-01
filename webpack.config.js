var webpack = require("webpack"),
    ENV     = process.env.ENV || 'development',
    DEV     = ENV == 'development';

function envPlugins() {
  var plugins;

  if (!DEV) {
    plugins = [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ];
  } else {
    plugins = [];
  }

  return plugins;
};

module.exports = {
  entry: "./src/bundle.js",

  output: {
    path: __dirname + '/dist',
    filename: "bundle.js"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel!jshint"
      },
      {
        test: /\.html/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },

  plugins: envPlugins(),

  jshint: {
    esnext: true
  },

  devtool: DEV ? 'source-map' : false,

  devServer: {
    contentBase: "./dist",
    port: 8000,
    noInfo: true,
    hot: false,
    inline: false
  }
};
