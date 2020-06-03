import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/terminals',
      method: 'get',
      params: data,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' })
      }
    })
  },
  editTerminal(id, data) {
    return axios({
      url: `/terminals/${id}`,
      method: 'put',
      data: qs.stringify(data)
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
  forbidAccessTerminal(data) {
    return axios({
      url: '/terminals/auditforbid',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  terminalsdetail(sn, data) {
    return axios({
      url: `/terminals/${sn}`,
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
