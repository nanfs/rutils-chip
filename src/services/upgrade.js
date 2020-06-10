import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/upgrades',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  editUpgrade(id, data) {
    return axios({
      url: `/upgrades/${id}`,
      method: 'put',
      data: qs.stringify(data)
    })
  },
  deleteUpgrade(data) {
    return axios({
      url: '/upgrades',
      method: 'delete',
      data: qs.stringify(data)
    })
  },
  upgradesdetail(sn, data) {
    return axios({
      url: `/upgrades/${sn}`,
      method: 'get',
      params: data
    })
  }
}
