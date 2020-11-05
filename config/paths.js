const path = require('path')

const appDirectory = path.resolve(__dirname, '..')
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  appDirectory,
  appDist: resolveApp('dist'),
  appDll: resolveApp('scripts/dll'),
  appSrc: resolveApp('src'),
  fonts: resolveApp('src/MyIcon/fonts'),
  appIndexJs: resolveApp('src/index.js'),
  appPolyfills: resolveApp('config/polyfills.js'),
  appConfig: resolveApp('config')
}
