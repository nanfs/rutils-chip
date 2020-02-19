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
      data: qs.stringify(data)
    })
  },
  update(id, data) {
    return axios({
      url: `/admitpolicys/${id}`,
      method: 'put',
      data: qs.stringify(data)
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
