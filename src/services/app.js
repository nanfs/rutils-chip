import qs from 'qs'
import axios from './axios'

export default {
  // 修改密码
  updatePwd(data) {
    return axios({
      url: '/user/changepassword',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
