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
  domainlist(data) {
    return axios({
      url: '/domainlist',
      method: 'get',
      params: data
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
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  addUser(data) {
    return axios({
      url: '/user/create',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  editUser(data) {
    return axios({
      url: '/user/update',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  deleteUser(data) {
    return axios({
      url: '/user/delete',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  disableUser(data) {
    return axios({
      url: '/user/locked',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  enableUser(data) {
    return axios({
      url: '/user/unlocked',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  desktopList(data) {
    return axios({
      url: '/user/desktoplist',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  tcList(data) {
    return axios({
      url: '/user/tclist',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
