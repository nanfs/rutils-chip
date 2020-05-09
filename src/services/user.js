import qs from 'qs'
import axios from './axios'

export default {
  checkSession(data) {
    return axios({
      url: '/user/session',
      params: data
    })
  },
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
  queryByGroup(data) {
    return axios({
      url: '/user/querybygroup',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  queryByAd(data) {
    return axios({
      url: '/user/querypublicuser',
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
  forbiddenUser(data) {
    return axios({
      url: '/user/forbidden',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  enableUser(data) {
    return axios({
      url: '/user/enable',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  unlockUser(data) {
    return axios({
      url: '/user/unlock',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  queryResources(data) {
    return axios({
      url: 'resources',
      method: 'get',
      params: data
    })
  },
  setRole(data) {
    return axios({
      url: '/user/adduserrole',
      method: 'post',
      data: qs.stringify(data, { allowDots: true, arrayFormat: 'indices' })
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
