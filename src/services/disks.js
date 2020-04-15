import qs from 'qs'
import axios from './axios'

export default {
  list({ vmId }) {
    return axios({
      url: `desktops/${vmId}/disks`,
      method: 'get'
    })
  },
  add({ vmId, ...rest }) {
    return axios({
      url: `desktops/${vmId}/disks`,
      method: 'post',
      data: qs.stringify(rest)
    })
  },
  edit({ vmId, id, ...rest }) {
    return axios({
      url: `desktops/${vmId}/disks/${id}`,
      method: 'post',
      data: qs.stringify(rest)
    })
  },
  delete({ vmId, ...rest }) {
    return axios({
      url: `desktops/${vmId}/disks/delete`,
      method: 'post',
      data: qs.stringify(rest, { allowDots: true, arrayFormat: 'indices' })
    })
  }
}
