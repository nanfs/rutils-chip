module.exports = {
  port: 9567,
  baseURL: '/ccsvm/desktop',
  proxy: {
    '/ccsvm/desktop': {
      target: 'http://192.168.200.2/ccsvm/desktop',
      changeOrigin: true,
      pathRewrite: { '^/ccsvm/desktop': '' },
      secure: false
    },
    '/api': {
      target: 'http://127.0.0.1:9999',
      changeOrigin: true,
      secure: false
    }
  }
}
