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
  editTerminal(id, data) {
    return axios({
      url: `/terminals/${id}`,
      method: 'put',
      data: qs.stringify(data)
    })
  },
  detail(sn) {
    return axios({
      url: `/terminals/${sn}`,
      method: 'get'
    })
  },
  deleteTerminal(data) {
    return axios({
      url: '/terminals',
      method: 'delete',
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
  },
  setUser(data) {
    return axios({
      url: '/terminals/users',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  setAccess(data) {
    return axios({
      url: '/terminals/admitpolicys',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  setDevice(data) {
    return axios({
      url: '/terminals/safepolicys',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  }
  /* terminalsusagedetail(data) {
    return axios({
      url: '/terminalsusagedetail',
      data: qs.stringify(data)
    })
  } */
}
