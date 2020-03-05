const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const os = require('os')

const OptimizeCss = require('optimize-css-assets-webpack-plugin')

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const cfgPaths = require('../config/paths')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
          MiniCssExtractPlugin.loader,
          // require.resolve('style-loader'),
          {
            loader: 'happypack/loader?id=happyLess'
          }
        ]
      },
      // {
      //   test: /[^.].\.(css|less)$/,
      //   loader: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: 'happypack/loader?id=happyLess',
      //     allChunks: true
      //   })
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
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
    // new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /de|fr|hu/),
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
          loader: 'babel-loader?cacheDirectory=true'
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
        'css-loader?sourceMap=true',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
            // modifyVars: { 'primary-color': 'red' }
          }
        }
      ],
      // 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: false
    }),
    // 提取css
    // new ExtractTextPlugin({ filename: 'style.[hash:4].css' }),
    // 关联dll拆分出去的依赖
    new webpack.DllReferencePlugin({
      manifest: path.resolve(cfgPaths.appDll, 'vendor-manifest.json'),
      context: cfgPaths.appDirectory
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new OptimizeCss({}),
    new WebpackBuildNotifierPlugin({
      title: '编译好了 看看吧',
      suppressSuccess: true
    })
  ]
}
module.exports = webpackConfigBase
