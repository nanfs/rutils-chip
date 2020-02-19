import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/desktoplogs',
      method: 'get',
      params: data
    })
  },
  // TODO 批量删除
  delete(data) {
    return axios({
      url: '/desktoplogs',
      method: 'delete'
      // params: data
    })
  }
}
