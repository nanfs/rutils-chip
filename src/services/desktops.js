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
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  batchAddVm(data) {
    return axios({
      url: '/desktops/batch',
      method: 'post',
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
  addVmByIso(data) {
    return axios({
      url: '/desktops/iso_create',
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
  getIso(data) {
    return axios({
      url: 'desktops/isos',
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
  },
  attachIso({ vmId, ...data }) {
    return axios({
      url: `/desktops/${vmId}/changeCd`,
      method: 'post',
      params: data
    })
  },
  snapList({ vmId }) {
    return axios({
      url: `/desktops/${vmId}/snapshots`,
      method: 'get'
    })
  },
  detailSnap({ vmId, snapId }) {
    return axios({
      url: `/desktops/${vmId}/snapshots/${snapId}`,
      method: 'get'
    })
  },
  addSnap({ vmId, ...data }) {
    return axios({
      url: `/desktops/${vmId}/snapshots`,
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  checkSnap({ vmId, snapId }) {
    return axios({
      url: `/desktops/${vmId}/snapshots/${snapId}/preview`,
      method: 'get'
    })
  },
  commitSnap({ vmId }) {
    return axios({
      url: `/desktops/${vmId}/snapshots/commit`,
      method: 'get'
    })
  },
  cancelSnap({ vmId }) {
    return axios({
      url: `/desktops/${vmId}/snapshots/undo`,
      method: 'get'
    })
  },
  deleteSnap({ vmId, snapId }) {
    return axios({
      url: `/desktops/${vmId}/snapshots/${snapId}`,
      method: 'delete'
    })
  }
}
