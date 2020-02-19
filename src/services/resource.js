import qs from 'qs'
import axios from './axios'

export default {
  // 计算资源列表
  listCompute(data) {
    return axios({
      url: '/resource/computing',
      method: 'get',
      data: qs.stringify(data)
    })
  },
  // 存储资源列表
  listSave(data) {
    return axios({
      url: '/resource/storage',
      method: 'get',
      data: qs.stringify(data)
    })
  }
}
