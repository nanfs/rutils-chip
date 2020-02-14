import qs from 'qs'
import axios from './axios'

export default {
  // 修改密码
  updatePwd(data) {
    return axios({
      url: '/employee/changePassword',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 系统设置
  updateConfig(data) {
    return axios({
      url: '/employee/changePassword',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
