import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/desktops/jobs',
      method: 'get',
      params: data
    })
  }
}
