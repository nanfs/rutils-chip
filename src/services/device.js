import qs from 'qs'
import axios from './axios'

export default {
  // 模板列表
  list(data) {
    return axios({
      url: '/safepolicys',
      method: 'get',
      params: data
    })
  },
  delDev(data) {
    return axios({
      url: '/safepolicys',
      method: 'delete',
      data: qs.stringify(data)
    })
  },
  addDev(data) {
    console.log(data)
    return axios({
      url: '/safepolicys',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  updateDev(id, data) {
    return axios({
      url: `/safepolicys/${id}`,
      method: 'put',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  }
}
