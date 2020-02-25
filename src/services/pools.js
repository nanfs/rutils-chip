import qs from 'qs'
import axios from './axios'

export default {
  // 模板列表
  list(data) {
    return axios({
      url: '/pools',
      method: 'get',
      params: data
    })
  },
  delPool(poolId) {
    return axios({
      url: `/pools/${poolId}`,
      method: 'delete'
    })
  },
  setUser(data) {
    return axios({
      url: '/pools',
      method: 'get',
      params: data
    })
  },
  addPool(data) {
    return axios({
      url: '/pools',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  editPool(data) {
    return axios({
      url: '/pools',
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
  vmList(data) {
    const { poolId, ...rest } = data
    const url = `/pool${poolId}/desktops`
    return axios({
      url: '/desktops',
      method: 'get',
      params: rest
    })
  },
  getVmConsole(data) {
    const { poolId, ...rest } = data
    const url = `/pool${poolId}/desktops`
    return axios({
      url: '/desktops',
      method: 'get',
      params: rest
    })
  },
  sendOrder(data) {
    const { poolId, ...rest } = data
    const url = `/pool${poolId}/desktops`
    return axios({
      url: '/pools',
      method: 'get',
      params: rest
    })
  },
  deleteVm(data) {
    const { poolId, ...rest } = data
    const url = `/pool${poolId}/desktops`
    return axios({
      url: '/pools',
      method: 'get',
      params: rest
    })
  }
}
