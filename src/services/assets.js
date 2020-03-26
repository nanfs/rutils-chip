import qs from 'qs'
import axios from './axios'

export default {
  clusters(data) {
    return axios({
      url: '/clusters',
      method: 'get',
      params: data
    })
  },
  datacenters(data) {
    return axios({
      url: '/datacenters',
      method: 'get',
      baseURL: '/api',
      params: data
    })
  },
  hosts(data) {
    return axios({
      url: '/hosts',
      method: 'get',
      baseURL: '/api',
      params: data
    })
  }
}