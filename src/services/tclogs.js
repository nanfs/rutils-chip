import qs from 'qs'
import axios from './axios'

export default {
  list(data) {
    return axios({
      url: '/tclogs',
      method: 'get',
      data: qs.stringify(data)
    })
  },
  add(data) {
    return axios({
      url: '/task/creating',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  edit(data) {
    return axios({
      url: '/task/updating',
      data: qs.stringify(data)
    })
  },
  detail(data) {
    return axios({
      url: '/task/detail',
      data: qs.stringify(data)
    })
  },
  delete(data) {
    return axios({
      url: '/task/deleting',
      data: qs.stringify(data)
    })
  },
  week_report_list(data) {
    return axios({
      url: '/task/project_report',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  week_report_list_personal(data) {
    console.log(data)
    return axios({
      url: '/task/personal_report',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
