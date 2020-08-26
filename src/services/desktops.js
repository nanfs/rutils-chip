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
  getOS(data) {
    return axios({
      url: '/clusters/os',
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
  snapList({ vmId, ...data }) {
    return axios({
      url: `/desktops/${vmId}/snapshots`,
      method: 'get',
      params: data
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
  },
  // 导出域详情
  exportDomains({ id }) {
    return axios({
      url: `/desktops/exportDomains/${id}`,
      method: 'get'
    })
  },
  // 虚拟机名称是否存在于导出域
  vmExistInExportDomain(data) {
    return axios({
      url: `/desktops/vmExistInExportDomain`,
      method: 'post',
      params: data
    })
  },
  // 模板是否存在于导出域
  templateExistInExportDomain(data) {
    return axios({
      url: `/templates/templateExistInExportDomain`,
      method: 'post',
      params: data
    })
  },
  // 导出虚拟机
  export(data) {
    return axios({
      url: `/desktops/export`,
      method: 'post',
      params: data
    })
  },
  // 数据中心列表
  storagePools(data) {
    return axios({
      url: `/storagePools`,
      method: 'get',
      params: data
    })
  },
  // 数据中心下集群列表
  getClusters({ id }) {
    return axios({
      url: `/clusters/${id}`,
      method: 'get'
    })
  },
  // 导出域下虚拟机列表
  vmListInDomain(data) {
    return axios({
      url: `/desktops/exportDomains`,
      method: 'post',
      params: data
    })
  },
  // 判断导入的虚拟机名称重名
  vmExistInSystem(data) {
    return axios({
      url: `/desktops/vmExistInSystem`,
      method: 'post',
      params: data
    })
  },
  // 导入虚拟机
  import(data) {
    return axios({
      url: `/desktops/import`,
      method: 'post',
      params: data
    })
  },
  // 台账导出
  assetExport(data) {
    return axios({
      url: `/desktops/export`,
      method: 'get',
      responseType: 'arraybuffer',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  }
}
