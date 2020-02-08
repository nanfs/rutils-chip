import { Observable } from 'rxjs/Observable'
import { request } from './utils'

export default {
  namespace: 'dashboard',
  state: {},

  reducers: {},
  epics: {},
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/dashboard') {
          console.log('触发首页事件')
        }
      })
    }
  }
}
