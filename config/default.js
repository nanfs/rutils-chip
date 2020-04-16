module.exports = {
  port: 9567,
  baseURL: '/ccsvm/desktop',
  proxy: {
    '/ccsvm/desktop': {
      target: 'http://192.168.254.220/ovirt-engine/desktop',
      // target: 'http://192.168.254.204/ovirt-engine/desktop',
      changeOrigin: true,
      pathRewrite: { '^/ovirt-engine/desktop': '' },
      secure: false
    },
    '/api': {
      target: 'http://127.0.0.1:9999',
      changeOrigin: true,
      secure: false
    }
  }
}
