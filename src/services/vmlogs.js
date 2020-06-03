import axios from './axios'
import qs from 'qs'

export default {
  list(data) {
    return axios({
      url: '/desktoplogs',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  delete(data) {
    return axios({
      url: '/desktoplogs',
      method: 'delete',
      data: qs.stringify(data)
    })
  },
  export(data) {
    return axios({
      url: '/desktoplogs/export',
      method: 'get',
      responseType: 'arraybuffer',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  }
}
