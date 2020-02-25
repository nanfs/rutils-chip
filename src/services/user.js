import qs from 'qs'
import axios from './axios'

export default {
  groupQuery(data) {
    return axios({
      url: '/group/query',
      method: 'post',
      params: data
    })
  },
  groupCreate(data) {
    return axios({
      url: '/group/create',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  groupUpdate(data) {
    return axios({
      url: '/group/update',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  groupDelete(data) {
    return axios({
      url: '/group/delete',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  descrip(data) {
    return axios({
      url: '/user/list',
      method: 'get',
      params: data
    })
  },
  list(data) {
    return axios({
      url: '/user/querybygroup',
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
  }
}
