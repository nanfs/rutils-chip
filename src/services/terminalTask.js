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
      url: '/schedulerTasks/delete',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  }
}
