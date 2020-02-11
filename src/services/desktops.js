import qs from 'qs'
import axios from './axios'

export default {
  // 模板列表
  list(data) {
    return axios({
      url: '/desktops',
      method: 'get',
      params: data
    })
  },
  delVm(data) {
    return axios({
      url: '/desktops',
      method: 'delete',
      params: data
    })
  },
  createVm(data) {
    return axios({
      url: '/desktops',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
