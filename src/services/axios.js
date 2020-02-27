import axios from 'axios'
import { message } from 'antd'
import { push } from 'react-router-redux'
import { setUserToLocal } from '@/components/Authorized'

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
const service = axios.create({
  baseURL, // api的base_url
  timeout: 3000, // 请求超时时间
  method: 'post',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
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
        console.log('203', response.data)
        setUserToLocal({})
        return push('/login')
      }
      return response.data
    }
    return checkStatus(response)
  },
  error => {
    checkStatus(error.response)
    return Promise.reject(error)
  }
)

export default service
