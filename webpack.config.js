var webpack = require("webpack"),
    yargs = require('yargs');

var libraryName = 'gymer',
    plugins = [],
    outputFile;

if (yargs.argv.p) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

module.exports = {
  entry: './src/gymer.ts',

  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: "Gymer",
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: "ts"
      },
      {
        test: /\.html/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },

  plugins: plugins,

  tslint: {
    emitErrors: true,
    failOnHint: true
  },

  devtool: 'source-map',

  devServer: {
    contentBase: ".",
    port: 8001,
    noInfo: true,
    hot: false,
    inline: false
  }
};
