// import collectionsApiFactory from '@/services/collectionsApiFactory'

// export default collectionsApiFactory('login')
import qs from 'qs'
import axios from './axios'

export default {
  login(data) {
    return axios({
      url: '/desktop/user/login',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  loginOut(data) {
    return axios({
      url: '/desktop/user/logout',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  getProperties() {
    return axios({
      url: '/properties.json',
      method: 'get',
      baseURL: '/'
    })
  }
}

/* import collectionsApiFactory from '@/services/collectionsApiFactory'

export default collectionsApiFactory('engines') */
