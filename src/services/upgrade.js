import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/packages',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  addUpgrade(data) {
    const requestData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key]) requestData.append(key, data[key])
    })
    return axios({
      url: `/packages`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'post',
      data: requestData
    })
  },
  deleteUpgrade(data) {
    return axios({
      url: '/packages',
      method: 'delete',
      data: qs.stringify(data)
    })
  },
  upgradesdetail(sn, data) {
    return axios({
      url: `/packages/${sn}`,
      method: 'get',
      params: data
    })
  }
}
