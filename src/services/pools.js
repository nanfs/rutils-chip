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
  detail(poolId) {
    return axios({
      url: `/pools/${poolId}`,
      method: 'get'
    })
  },
  setUser(data) {
    return axios({
      url: '/pools/users',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
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
    const { poolId, ...rest } = data
    return axios({
      url: `/pool${poolId}`,
      method: 'post',
      data: qs.stringify(rest)
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
    return axios({
      url: `/pool/${poolId}/desktops`,
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
