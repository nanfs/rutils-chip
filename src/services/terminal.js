import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/terminals',
      method: 'get',
      data: qs.stringify(data)
    })
  },
  add(data) {
    return axios({
      url: '/task/creating',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  edit(data) {
    return axios({
      url: '/task/updating',
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
