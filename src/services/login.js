// import collectionsApiFactory from '@/services/collectionsApiFactory'

// export default collectionsApiFactory('login')
import qs from 'qs'
import axios from './axios'

export default {
  login(data) {
    return axios({
      url: '/login',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}

/* import collectionsApiFactory from '@/services/collectionsApiFactory'

export default collectionsApiFactory('engines') */
