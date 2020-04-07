import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/tasks',
      method: 'get',
      baseURL: '/api',
      params: data
    })
  }
}
