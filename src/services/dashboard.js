import qs from 'qs'
import axios from './axios'

export default {
  desktopsStatistics(data) {
    return axios({
      url: '/desktops/state/statistics',
      method: 'get',
      params: data
    })
  },
  poolsStatistics(data) {
    return axios({
      url: '/pools/state/statistics',
      method: 'get',
      params: data
    })
  },
  terminalsStatistics(data) {
    return axios({
      url: '/terminals/state/statistics',
      method: 'get',
      params: data
    })
  },
  usersStatistics(data) {
    return axios({
      url: '/users/state/statistics',
      method: 'get',
      params: data
    })
  }
}
