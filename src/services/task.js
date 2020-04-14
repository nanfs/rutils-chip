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
  addTask(data) {
    return axios({
      url: `/schedulerTasks`,
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  editTask(id, data) {
    return axios({
      url: `/schedulerTasks/${id}`,
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  detail(data) {
    const { id } = data
    delete data.id
    return axios({
      url: `/schedulerTasks/${id}`,
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
  },
  admitTask(data) {
    return axios({
      url: '/schedulerTasks/resume',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  forbidTask(data) {
    return axios({
      url: '/schedulerTasks/pause',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  }
}
