import { push } from 'react-router-redux'
import { setUserToLocal } from '@/components/Authorized'
import { cleanRequest } from './utils'

export default {
  namespace: 'app',
  state: {
    username: null,
    isSideFold: false,
    identificationNumber: null
  },
  reducers: {
    toggleSideFold: state => {
      return {
        ...state,
        isSideFold: !state.isSideFold
      }
    },
    getProperties: (state, payload) => {
      return {
        ...state,
        ...payload
      }
    }
  },
  epics: {
    logout: action$ =>
      action$.map(() => {
        setUserToLocal({})
        return push('/login')
      }),
    // TODO 是否开启强制登录
    getUserInfo: action$ =>
      action$
        .filter(({ state }) => !state.loginSuccess)
        .mapTo({ type: 'app/logout' }),
    cleanMeta: action$ =>
      action$.map(({ payload }) =>
        cleanRequest(payload.namespace, payload.meta)
      ),
    cleanResult: action$ =>
      action$.map(({ payload }) => {
        const [namespace, dataindex] = payload.split('/')
        return cleanRequest(namespace, dataindex)
      })
  }
  // subscriptions: {
  //   setup ({ dispatch, history }) {
  //     dispatch({ type: 'getUserInfo' })
  //     return history.listen(({ pathname }) => {
  //       if (pathname === '/') {
  //         dispatch({ type: 'getUserInfo' })
  //       }
  //     })
  //   }
  // }
}
