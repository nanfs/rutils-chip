import qs from 'qs'
import axios from './axios'

export default {
  // 模板列表
  list(data) {
    return axios({
      timeout: 10000,
      url: '/templates',
      method: 'get',
      data: qs.stringify(data)
    })
  },
  addTem(data) {
    return axios({
      url: '/templates',
      method: 'post',
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
    const { id, ...reqData } = data
    return axios({
      url: `/templates/${id}`,
      method: 'put',
      data: qs.stringify(reqData, { arrayFormat: 'indices', allowDots: true })
    })
  }
}
