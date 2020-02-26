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
  setUser({ poolId, users }) {
    return axios({
      url: `/pools/${poolId}/users`,
      method: 'post',
      data: qs.stringify({ users }, { arrayFormat: 'indices', allowDots: true })
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
    const { poolId, values } = data
    return axios({
      url: `/pools/${poolId}`,
      method: 'post',
      data: qs.stringify(values)
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
      url: `/pools/${poolId}/desktops`,
      method: 'get',
      params: rest
    })
  },

  deleteVm(data) {
    const { poolId, ...rest } = data
    const url = `/pools/${poolId}/desktops`
    return axios({
      url: '/pools',
      method: 'get',
      params: rest
    })
  }
}
