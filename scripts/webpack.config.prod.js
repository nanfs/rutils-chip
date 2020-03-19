const merge = require('webpack-merge')
const Copy = require('copy-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const webpackConfigBase = require('./webpack.config.base')
const cfgPaths = require('../config/paths')

const webpackConfigProd = {
  mode: 'production',
  output: {
    path: cfgPaths.appDist
  },
  // TODO 关闭压缩后报错
  optimization: {
    minimize: false
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: cfgPaths.appDirectory,
      verbose: false
    }),
    new HtmlWebpackPlugin({
      title: 'Prod',
      template: cfgPaths.appHtml,
      favicon: cfgPaths.favicon,
      hash: true,
      dlls: ['./vendor.dll.js']
      // minify: {
      //   caseSensitive: false,
      //   removeComment: true, // 移除注释
      //   collapseWhitespace: false // 移除多余空格
      // }
    }),
    // new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    new Copy([{ from: './scripts/dll', to: './' }]),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8
    })
    // new WebpackSftpClient({
    //   port: '22',
    //   host: '192.168.254.211',
    //   username: 'root',
    //   password: '123456',
    //   path: './dist/', // 本地上传目录
    //   remotePath:
    //     '/usr/share/ovirt-engine/engine.ear/cetccloud-desktop.war/WEB-INF/classes/static', // 服务器目标目录
    //   verbose: true
    // })
  ]
}

module.exports = merge(webpackConfigBase, webpackConfigProd)
