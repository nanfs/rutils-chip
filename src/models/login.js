import { push } from 'react-router-redux'
import { reloadAuthorized, setUserToLocal } from '@/components/Authorized'
import { request } from './utils'
import loginApi from '@/services/login'

export default {
  namespace: 'login',
  state: {},
  epics: {
    login: action$ =>
      action$.map(({ payload }) =>
        request('login', 'login', loginApi.login, 'login', payload)
      ),
    loginSuccess: action$ =>
      action$.map(({ payload }) => {
        setUserToLocal(payload && payload.data)
        reloadAuthorized()
        return push('/')
      })
  }
}
