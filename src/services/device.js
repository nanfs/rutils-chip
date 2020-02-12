import qs from 'qs'
import axios from './axios'

export default {
  // 模板列表
  list(data) {
    return axios({
      url: '/safepolicys',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  delDev(data) {
    return axios({
      url: '/delDev',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  addDev(data) {
    return axios({
      url: '/addDev',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  updateDev(data) {
    return axios({
      url: '/updateDev',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
