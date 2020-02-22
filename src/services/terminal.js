import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/terminals',
      method: 'get',
      params: data
    })
  },
  editTerminal(data) {
    return axios({
      url: '/terminals',
      method: 'put',
      data: qs.stringify(data)
    })
  },
  deleteTerminal(data) {
    return axios({
      url: '/terminals',
      method: '/delete',
      data: qs.stringify(data)
    })
  },
  directiveTerminal(data) {
    return axios({
      url: '/terminals/directives',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  admitAccessTerminal(data) {
    return axios({
      url: '/terminals/auditpass',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  terminalsdetail(id, data) {
    return axios({
      url: `/terminals/${id}`,
      method: 'get',
      params: data
    })
  }
  /* terminalsusagedetail(data) {
    return axios({
      url: '/terminalsusagedetail',
      data: qs.stringify(data)
    })
  } */
}
