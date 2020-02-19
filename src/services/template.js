import qs from 'qs'
import axios from './axios'

export default {
  // 模板列表
  list(data) {
    return axios({
      url: '/templates',
      method: 'get',
      data: qs.stringify(data)
    })
  },
  delTem(data) {
    return axios({
      url: '/templates',
      method: 'delete',
      data: qs.stringify(data)
    })
  },
  updateTem(data) {
    return axios({
      url: '/updateTem',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
