import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/users',
      method: 'get',
      data: qs.stringify(data)
    })
  },
  edit(data) {
    return axios({
      url: '/updating',
      data: qs.stringify(data)
    })
  },
  lockUser(data) {
    return axios({
      url: '/lockUser',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  unlockUser(data) {
    return axios({
      url: '/unlockUser',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  deleteUser(data) {
    return axios({
      url: '/deleteUser',
      method: 'delete',
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
