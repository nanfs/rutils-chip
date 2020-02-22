import qs from 'qs'
import axios from './axios'

export default {
  // 模板列表
  list(data) {
    return axios({
      url: '/desktops',
      method: 'get',
      params: data
    })
  },
  delVm(data) {
    return axios({
      url: '/desktops',
      method: 'delete',
      params: data
    })
  },
  setUser(data) {
    return axios({
      url: '/desktops',
      method: 'get',
      params: data
    })
  },
  addVm(data) {
    return axios({
      url: '/desktops',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  editVm(data) {
    return axios({
      url: '/desktops',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getTemplate(data) {
    return axios({
      url: '/templates',
      method: 'get',
      params: data
    })
  },
  sendOrder(data) {
    return axios({
      url: '/desktops/directives ',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getNetwork(data) {
    return axios({
      url: '/desktops',
      method: 'get',
      params: data
    })
  }
}
