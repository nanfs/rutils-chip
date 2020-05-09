import { push } from 'react-router-redux'
import { setItemToLocal } from '@/utils/storage'

export default {
  namespace: 'app',
  state: {
    isSideFold: false
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
  epics: {}
}
