import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      baseURL: '/api',
      url: '/vmgroups/list',
      params: data
    })
  },
  delete(data) {
    return axios({
      url: '/vmgroups',
      method: 'delete',
      data: qs.stringify(data)
    })
  },
  add(data) {
    return axios({
      url: '/vmgroups',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  edit(data) {
    const { id, ...values } = data
    return axios({
      url: `/vmgroups/${id}`,
      method: 'post',
      data: qs.stringify(values, { arrayFormat: 'indices', allowDots: true })
    })
  },
  remove(data) {
    const { id, ...values } = data
    return axios({
      url: `/vmgroups/${id}`,
      method: 'post',
      data: qs.stringify(values, { arrayFormat: 'indices', allowDots: true })
    })
  },
  moveIn(data) {
    const { id, ...values } = data
    return axios({
      url: `/vmgroups/${id}`,
      method: 'post',
      data: qs.stringify(values, { arrayFormat: 'indices', allowDots: true })
    })
  }
}
