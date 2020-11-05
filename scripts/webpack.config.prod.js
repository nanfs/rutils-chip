const merge = require('webpack-merge')
const Copy = require('copy-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpackConfigBase = require('./webpack.config.base')
const cfgPaths = require('../config/paths')

const webpackConfigProd = {
  mode: 'production',
  output: {
    path: cfgPaths.appDist
  },
  optimization: {
    // minimize: false
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'] // 移除console
          }
        }
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Copy([{ from: './scripts/dll', to: './' }]),
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
