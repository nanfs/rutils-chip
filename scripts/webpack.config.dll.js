const webpack = require('webpack')
const path = require('path')
// const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const cfgPaths = require('../config/paths')

const plugin = [
  new webpack.DllPlugin({
    path: path.resolve(cfgPaths.appDll, '[name]-manifest.json'),
    name: '[name]',
    context: cfgPaths.appDirectory
  })
]
if (process.env.NODE_ENV === 'product') {
  // TODO 打包插件问题
  // plugin.push(
  //   new ParallelUglifyPlugin({
  //     cacheDir: '.cache/',
  //     uglifyJS: {
  //       output: {
  //         comments: false
  //       }
  //     }
  //   })
  // )
}
module.exports = {
  stats: 'errors-only',
  output: {
    path: cfgPaths.appDll,
    filename: '[name].dll.js',
    library: '[name]'
  },
  entry: {
    vendor: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router-dom',
      'history',
      'redux-observable',
      'react-router-redux'
    ]
  },

  plugins: plugin
}
