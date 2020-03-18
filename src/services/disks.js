import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/disks',
      method: 'get',
      params: data,
      baseURL: '/api'
    })
  },
  add(data) {
    return axios({
      url: '/disks',
      method: 'post',
      baseURL: '/api',
      data: qs.stringify(data)
    })
  },
  delete(data) {
    return axios({
      url: '/disks',
      method: 'delete',
      baseURL: '/api',
      data: qs.stringify(data)
    })
  }
}
