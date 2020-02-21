import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/admitpolicys',
      method: 'get',
      data: qs.stringify(data)
    })
  },
  add(data) {
    return axios({
      url: '/admitpolicys',
      method: 'post',
      data: qs.stringify(data, { allowDots: true, arrayFormat: 'indices' })
    })
  },
  update(data) {
    const { id, ...reqData } = data
    return axios({
      url: `/admitpolicys/${id}`,
      method: 'put',
      data: qs.stringify(reqData, { allowDots: true, arrayFormat: 'indices' })
    })
  },
  del(data) {
    return axios({
      url: '/admitpolicys',
      method: 'delete',
      data: qs.stringify(data)
    })
  }
}
