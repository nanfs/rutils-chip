import axios from './axios'
import qs from 'qs'

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
      data: qs.stringify(data)
    })
  }
}
