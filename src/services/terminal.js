import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/terminals',
      method: 'get',
      params: data
    })
  },
  edit(data) {
    return axios({
      url: '/updating',
      data: qs.stringify(data)
    })
  },
  onTerminal(data) {
    return axios({
      url: '/onTerminal',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  offTerminal(data) {
    return axios({
      url: '/onTerminal',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  admitAccessTerminal(data) {
    return axios({
      url: '/onTerminal',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  terminalsdetail(data) {
    return axios({
      url: '/terminalsdetail',
      data: qs.stringify(data)
    })
  },
  terminalsusagedetail(data) {
    return axios({
      url: '/terminalsusagedetail',
      data: qs.stringify(data)
    })
  }
}
