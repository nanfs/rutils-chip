import axios from './axios'
import qs from 'qs'

export default {
  list(data) {
    return axios({
      url: '/tclogs',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  delete(data) {
    return axios({
      url: '/tclogs',
      method: 'delete',
      data: qs.stringify(data)
    })
  },
  export(data) {
    return axios({
      url: '/tclogs/export',
      method: 'get',
      responseType: 'arraybuffer',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  }
}
