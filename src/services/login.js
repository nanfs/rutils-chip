import qs from 'qs'
import axios from './axios'

export default {
  login(data) {
    return axios({
      timeout: 50000,
      url: '/user/login',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  loginOut(data) {
    return axios({
      url: '/user/logout',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getProperties() {
    return axios({
      url: '/properties.json',
      method: 'get',
      baseURL: '/'
    })
  }
}
