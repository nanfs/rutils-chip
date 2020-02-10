import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/tclogs',
      method: 'get',
      params: data
    })
  },
  delete(data) {
    return axios({
      url: '/tclogs',
      method: 'delete',
      params: data
    })
  }
}
