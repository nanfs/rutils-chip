import qs from 'qs'
import axios from './axios'

export default {
  // 计算资源列表
  listCompute(data) {
    return axios({
      url: '/resource/computing',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  // 存储资源列表
  listSave(data) {
    return axios({
      url: '/resource/storage',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  clusterVms(data) {
    return axios({
      url: '/cluster/vms',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  }
}
