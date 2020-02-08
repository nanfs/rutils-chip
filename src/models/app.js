import { push } from 'react-router-redux'
import { Observable } from 'rxjs/Observable'
import { setUserToLocal } from '../components/Authorized'
import { cleanRequest, request } from './utils'
import appApi from '@/services/app'

export default {
  namespace: 'app',
  state: {
    username: null,
    identificationNumber: null
  },
  reducers: {},
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
      }),
    updatePwd: action$ =>
      action$.map(({ state }) =>
        request(
          'app',
          'updatePwd',
          appApi.updatePwd,
          'updatePwd',
          {
            oldPassword: state.password.oldPassword,
            password: state.password.password
          },
          true
        )
      ),
    updatePwdSuccess: action$ =>
      action$.mergeMap(() =>
        Observable.of(
          // { type: 'app/openTips', payload: '密码修改成功,请重新登录!' },
          { type: 'app/closeSetPwd' },
          { type: 'app/logout' }
        )
      )
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
