const path = require('path')

const { merge } = require('webpack-merge')
const config = require('./webpack.config')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(config, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin()
  ],
  output: {
    path: path.join(__dirname, 'public')
  }
})
