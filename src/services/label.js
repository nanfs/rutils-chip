import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/schedulerTasks',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  add(data) {
    return axios({
      url: `/schedulerTasks`,
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  edit(id, data) {
    return axios({
      url: `/schedulerTasks/${id}`,
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  }
}
