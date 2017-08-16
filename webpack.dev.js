const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const BabiliWebpackPlugin = require('babili-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: './js/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build/js')
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
  },
  module: {
    loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }

    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new CopyWebpackPlugin([{from: 'static', to: '../'}]),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      popper: "popper.js",
      bootstrap: "bootstrap"
    })
  ]
}