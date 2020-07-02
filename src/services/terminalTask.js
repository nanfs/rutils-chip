import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/tasks',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  deleteTask(data) {
    return axios({
      url: '/tasks',
      method: 'delete',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  }
}
