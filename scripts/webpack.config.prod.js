const webpack = require('webpack')
const merge = require('webpack-merge')
const Copy = require('copy-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const webpackConfigBase = require('./webpack.config.base')
const cfgPaths = require('../config/paths')

const webpackConfigProd = {
  output: {
    path: cfgPaths.appDist
  },
  plugins: [
    // 定义环境变量为开发环境
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // 将打包后的资源注入到html文件内
    new HtmlWebpackPlugin({
      // inject: true, // will inject the main bundle to index.html
      title: 'Prod',
      template: cfgPaths.appHtml,
      favicon: cfgPaths.favicon,
      // 这里列出要加入html中的js文件
      dlls: ['./vendor.dll.js']
    }),
    /* 多核压缩代码 */
    /* new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false
        },
        warnings: false,
        compress: {
          drop_debugger: true,
          drop_console: true
        }
        // compress: {
        //   warnings: false
        // }
      }
    }), */
    // 分析代码
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    new Copy([{ from: './scripts/dll', to: './' }]),
    new CleanWebpackPlugin(['dist'], {
      root: cfgPaths.appDirectory,
      verbose: false
      // exclude:['img']//不删除img静态资源
    }),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}

module.exports = merge(webpackConfigBase, webpackConfigProd)
