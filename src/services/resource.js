import qs from 'qs'
import axios from './axios'

export default {
  // 计算资源列表
  listCompute(data) {
    return axios({
      url: '/hosts',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 存储资源列表
  listSave(data) {
    return axios({
      url: '/storages',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
