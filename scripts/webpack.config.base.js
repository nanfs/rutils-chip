const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const os = require('os')

const OptimizeCss = require('optimize-css-assets-webpack-plugin')

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const cfgPaths = require('../config/paths')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const GeneraterAssetPlugin = require('generate-asset-webpack-plugin')
const propertiesConfig = require('../public/properties.json')

const setBuildNo = function() {
  const date = new Date()
  const Y = date.getFullYear() - 2020 + 1
  let M = date.getMonth() + 1
  let D = date.getDate()
  if (M < 10) {
    M = `0${M}`
  }
  if (D < 10) {
    D = `0${D}`
  }
  const MD = +`${M}${D}`
  const mask = Y * 10000 + MD + 1234 + date.getFullYear()
  return mask
}
const createJson = function() {
  const build = setBuildNo()
  return JSON.stringify({
    ...propertiesConfig,
    build
  })
}
const includePath = [cfgPaths.appSrc]
const webpackConfigBase = {
  stats: 'errors-only',
  entry: {
    polyfills: cfgPaths.appPolyfills,
    app: [cfgPaths.appIndexJs]
  },
  output: {
    path: cfgPaths.appDll,
    filename: '[name].[hash].js',
    chunkFilename: 'chunks/[name].[hash:4].js'
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': cfgPaths.appSrc,
      '*': cfgPaths.appConfig
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: 'happypack/loader?id=happyEslint',
        include: includePath,
        exclude: /node_modules/
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'happypack/loader?id=happyBabel'
      },

      {
        test: /\.m\.less$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: true,
              localIdentName: '[local]_[hash:base64:5]'
            }
          },
          require.resolve('less-loader')
        ]
      },
      {
        test: /[^.].\.(css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          {
            loader: 'happypack/loader?id=happyLess'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: [/node_modules/, cfgPaths.fonts],
        include: includePath,
        loader: 'file-loader',
        options: {
          limit: 8192,
          name: 'img/[name].[hash:4].[ext]'
        }
      },
      {
        test: /\.(woff|eot|ttf|svg|gif)$/,
        loader: 'file-loader',
        include: [cfgPaths.fonts],
        options: {
          limit: 8192,
          name: 'font/[name].[hash:4].[ext]'
        }
      }
    ]
  },
  plugins: [
    // 去除moment的语言包
    new ProgressBarPlugin(),
    new CaseSensitivePathsPlugin(),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'happyEslint',
      // 如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: 'eslint-loader',
          options: {
            fix: true
          }
        }
      ],
      // 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: false
    }),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      // 如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: 'babel-loader'
        }
      ],
      // 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: false
    }),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'happyLess',
      // 如何处理  用法和loader 的配置一样
      loaders: [
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
            modifyVars: { 'border-radius-base': '2px' }
          }
        }
      ],
      // 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: false
    }),
    new GeneraterAssetPlugin({
      filename: 'properties.json', // 输出到dist根目录下的serverConfig.json文件,名字可以按需改
      fn: (compilation, cb) => {
        cb(null, createJson(compilation))
      }
    }),
    // 提取css
    // 关联dll拆分出去的依赖
    new webpack.DllReferencePlugin({
      manifest: path.resolve(cfgPaths.appDll, 'vendor-manifest.json'),
      context: cfgPaths.appDirectory
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name][hash].css',
      chunkFilename: 'css/[id][hash].css'
    }),
    new OptimizeCss({}),
    new AntdDayjsWebpackPlugin(),
    new WebpackBuildNotifierPlugin({
      title: '编译好了 看看吧',
      suppressSuccess: true
    })
  ]
}
module.exports = webpackConfigBase
