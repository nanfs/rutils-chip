import axios from 'axios'
import { message } from 'antd'
// import { push } from 'react-router-redux'
import { setItemToLocal } from '@/utils/storage'

const cfg = require('../../config/default')

const { baseURL } = cfg
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

function checkStatus(response = {}) {
  const {
    status,
    statusText,
    config: { url }
  } = response
  if ((status >= 200 && status < 300) || status === 409) {
    return response
  }
  const errortext = codeMessage[status] || statusText
  message.error(`${status}: ${url} ${errortext}`)
}

/** **** 创建axios实例 ***** */
// TODO 3分钟超时
const service = axios.create({
  baseURL, // api的base_url
  timeout: 30000, // 请求超时时间30s
  method: 'post',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Fetch-origin': 'ccsvm', // 后端用来判断 是从终端还是平台发起的请求
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS'
  }
})

/** **** request拦截器==>对请求参数做处理 ***** */
service.interceptors.request.use(
  config => {
    // 必要可以做一些操作
    return config
  },
  error => {
    // 请求错误处理
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    // Do something with response data
    // localStorage.setItem('cookie', response.headers['set-cookie'])
    if (response.data) {
      if (response.data.code === '203') {
        setItemToLocal(null)
        window.location.hash = 'login'
        // 不弹出提示
        // return message.error(response.data.message || '请先登录')
      }
      return response.data
    }
    return checkStatus(response)
  },
  error => {
    if (
      error.code === 'ECONNABORTED' &&
      error.message.indexOf('timeout') !== -1
    ) {
      // eslint-disable-next-line
      return Promise.reject({ message: '接口处理超时!', type: 'timeout' })
    }
    if (error.message.indexOf('Network Error') !== -1) {
      // eslint-disable-next-line
      return Promise.reject({ message: '网络错误，请检查网络!', type: 'NetworkError' })
    }
    checkStatus(error.response)
    return Promise.reject(error)
  }
)

export default service
