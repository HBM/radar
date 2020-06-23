'use strict'

require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: path.join(__dirname, '/src'),
  entry: {
    app: './index.js'
  },
  output: {
    path: path.join(__dirname, '/prod'),
    filename: '[name].bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, '/src'),
    host: '0.0.0.0'
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules(?!(\/|\\)md-components)/,
        use: [{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: ['url-loader?limit=10000']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    favicon: 'favicon.ico',
    template: 'index.html'
  })]
}
