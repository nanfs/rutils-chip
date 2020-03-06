const webpack = require('webpack')
const path = require('path')
const cfgPaths = require('../config/paths')

module.exports = {
  stats: 'errors-only',
  output: {
    path: cfgPaths.appDll,
    filename: '[name].dll.js',
    library: '[name]'
  },
  entry: {
    vendor: [
      // 'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router-dom',
      'history',
      'redux-observable',
      'react-router-redux'
    ]
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(cfgPaths.appDll, '[name]-manifest.json'),
      name: '[name]',
      context: cfgPaths.appDirectory
    })
  ]
}
