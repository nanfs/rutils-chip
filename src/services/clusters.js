import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/clusters',
      method: 'get',
      baseURL: '/api',
      params: data
    })
  },
  add(data) {
    return axios({
      url: '/clusters',
      method: 'post',
      data: qs.stringify(data, { allowDots: true, arrayFormat: 'indices' })
    })
  },
  update(data) {
    const { id, ...reqData } = data
    return axios({
      url: `/clusters/${id}`,
      method: 'put',
      data: qs.stringify(reqData, { allowDots: true, arrayFormat: 'indices' })
    })
  },
  delete(data) {
    return axios({
      url: '/clusters',
      method: 'delete',
      data: qs.stringify(data)
    })
  }
}
