import qs from 'qs'
import axios from './axios'

export default {
  // 修改密码
  edit(data) {
    return axios({
      url: '/systemsetting',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 系统设置
  datail() {
    return axios({
      url: '/systemsetting',
      method: 'get'
    })
  }
}
