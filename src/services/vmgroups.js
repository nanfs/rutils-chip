import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/desktopgroups',
      method: 'get',
      params: data
    })
  },
  // 桌面组中的桌面列表
  vmlist({ groupId, ...data }) {
    return axios({
      url: `/desktopgroups/${groupId}/desktops`,
      method: 'get',
      params: data
    })
  },
  // 当前桌面可以添加的桌面列表
  addible({ groupId, ...data }) {
    return axios({
      url: `/desktopgroups/${groupId}/desktops/addible`,
      method: 'get',
      params: data
    })
  },
  delete(data) {
    return axios({
      url: '/desktopgroups',
      method: 'delete',
      data: qs.stringify(data)
    })
  },
  add(data) {
    return axios({
      url: '/desktopgroups',
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  edit({ id, ...data }) {
    return axios({
      url: `/desktopgroups/${id}`,
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  remove({ groupId, ...data }) {
    return axios({
      url: `/desktopgroups/${groupId}/desktops`,
      method: 'delete',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  moveIn({ groupId, ...data }) {
    return axios({
      url: `/desktopgroups/${groupId}/desktops`,
      method: 'post',
      data: qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
  },
  setPeaks(data) {
    const { id, ...values } = data
    return axios({
      url: `/desktopgroups/${id}`,
      method: 'post',
      data: qs.stringify(values, { arrayFormat: 'indices', allowDots: true })
    })
  }
}
