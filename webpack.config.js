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
  entry: "./src/bundle.ts",

  output: {
    path: __dirname + '/dist',
    filename: "bundle.js"
  },

  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "babel!ts"
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
    port: 8001,
    noInfo: true,
    hot: false,
    inline: false
  }
};
