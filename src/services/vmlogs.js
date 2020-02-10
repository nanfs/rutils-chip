import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/vmlogs',
      method: 'get',
      params: data
    })
  },
  delete(data) {
    return axios({
      url: '/vmlogs',
      method: 'delete',
      params: data
    })
  }
}
