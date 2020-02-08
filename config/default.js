module.exports = {
  port: 9567,
  baseURL: '/api',
  proxy: {
    '/oa': {
      target: 'http://192.168.8.120:8085/oa',
      changeOrigin: true,
      pathRewrite: { '^/oa': '' },
      secure: false
    },
    '/api': {
      target: 'http://127.0.0.1:9999',
      changeOrigin: true,
      secure: false
    }
  }
}
