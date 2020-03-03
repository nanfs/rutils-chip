import qs from 'qs'
import axios from './axios'

export default {
  // 模板列表
  list(data) {
    return axios({
      url: '/desktops',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  detail(id) {
    return axios({
      url: `/desktops/${id}`,
      method: 'get'
    })
  },
  delVm(data) {
    return axios({
      url: '/desktops',
      method: 'delete',
      data: qs.stringify(data)
    })
  },
  setUser(data) {
    return axios({
      url: '/desktops/users',
      method: 'post',
      timeout: 500,
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  addVm(data) {
    return axios({
      url: '/desktops',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  editVm(data) {
    const { id, ...values } = data
    return axios({
      url: `/desktops/${id}`,
      method: 'post',
      data: qs.stringify(values, { arrayFormat: 'indices', allowDots: true })
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
  getNetwork(id) {
    return axios({
      url: `/networks/${id}`,
      method: 'get'
    })
  },
  openConsole(data) {
    return axios({
      url: '/desktops/console',
      method: 'get',
      params: data,
      responseType: 'arraybuffer'
    })
  }
}
