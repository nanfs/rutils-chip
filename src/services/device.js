import qs from 'qs'
import axios from './axios'

export default {
  // 模板列表
  list(data) {
    return axios({
      url: '/safepolicys',
      method: 'get',
      data: qs.stringify(data)
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
    return axios({
      url: '/safepolicys',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  updateDev(id, data) {
    return axios({
      url: `/safepolicys/${id}`,
      method: 'put',
      data: qs.stringify(data)
    })
  }
}
