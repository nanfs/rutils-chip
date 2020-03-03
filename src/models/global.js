import { Observable } from 'rxjs/Observable'
import { notification, message } from 'antd'
import { getIn, setIn, deleteIn } from './structure'

export default {
  namespace: 'global',
  state: {
    data: {}
  },
  reducers: {
    request: (state, { meta }) => {
      const { dataIndex, namespace, action, starttime } = meta
      let result = state
      /**
       * 如果本次是reload 上次是fetch 并且 fetch的请求在reload之后 本次reload请求 丢弃
       * 除此之外本次是reload 将loading置为false（不显示页面刷新状态）
       * 登记 starttime action 返回数据
       */
      let dataItem = getIn(result, `data.${namespace}/${dataIndex}`)
      dataItem = setIn(dataItem, 'loading', true)
      dataItem = setIn(dataItem, 'error', null)
      dataItem = setIn(dataItem, 'starttime', starttime)
      dataItem = setIn(dataItem, 'action', action)
      result = setIn(result, `data.${namespace}/${dataIndex}`, dataItem)
      return result
    },

    requestSuccess: (state, { meta, payload }) => {
      const { dataIndex, namespace, action, starttime } = meta

      const { message: msg, code, success } = payload
      const jsondata = payload.data ? payload.data : {}
      let result = state
      let dataItem = getIn(result, `data.${namespace}/${dataIndex}`)
      dataItem = setIn(dataItem, 'endtime', +new Date())
      dataItem = setIn(dataItem, 'loading', false)
      dataItem = setIn(dataItem, 'action', action)
      dataItem = setIn(dataItem, 'code', code)
      dataItem = setIn(dataItem, 'success', success)
      dataItem = setIn(dataItem, 'message', msg)
      /**
       * 如果本次操作 和之前一样的action 说明是一样的请求。
       * 根据开始时间 抛弃结果  dataItem表示上一次的状态  meta表示这一次的状态
       */
      if (action === dataItem.action && starttime < dataItem.starttime) {
        return result
      }
      /**
       * 针对reload和 fetch 两个执行相同的请求,  reload 开始时间早于 fetch 的就丢弃
       * 不保留数据  更新loading值
       */

      if (
        action.indexOf('reload') !== -1 &&
        dataItem.action.indexOf('fetch') !== -1 &&
        starttime < dataItem.starttime
      ) {
        dataItem = setIn(dataItem, 'loading', true)
        return result
      }
      dataItem = setIn(dataItem, 'data', jsondata)

      result = setIn(result, `data.${namespace}/${dataIndex}`, dataItem)
      return result
    },
    requestFailed: (state, { meta, payload }) => {
      const { dataIndex, namespace } = meta
      const { message: msg, code, success } = payload
      let result = state
      let dataItem = getIn(result, `data.${namespace}/${dataIndex}`)
      dataItem = setIn(dataItem, 'loading', false)
      dataItem = setIn(dataItem, 'error', payload.message)
      dataItem = setIn(dataItem, 'code', code)
      dataItem = setIn(dataItem, 'success', success)
      dataItem = setIn(dataItem, 'message', msg)
      result = setIn(result, `data.${namespace}/${dataIndex}`, dataItem)
      return result
    },
    cleanRequest: (state, { meta }) => {
      const { dataIndex, namespace } = meta
      return deleteIn(state, `data.${namespace}/${dataIndex}`)
    }
  },
  epics: {
    request: action$ =>
      action$.mergeMap(({ meta, payload }) => {
        const { obApi } = meta
        return obApi(payload)
          .map(res => ({ type: 'global/requestSuccess', payload: res, meta }))
          .delay(1000)
          .catch(error =>
            Observable.of({
              type: 'global/requestFailed',
              payload: error,
              meta
            }).delay(1000)
          )
      }),
    requestSuccess: action$ =>
      action$.map(({ meta: { namespace, action, wrapResult }, payload }) => {
        if (payload.success) {
          wrapResult &&
            notification.success({ message: payload.message || '操作成功' })
          return { type: `${namespace}/${action}Success`, payload }
        }
        if (payload.code && payload.code === '202') {
          return { type: 'app/logout' }
        }
        wrapResult && message.error(payload.message || '操作失败')
        return { type: `${namespace}/${action}Fail`, payload }
      }),
    requestFailed: action$ =>
      action$.map(({ meta: { namespace, action }, payload }) => ({
        type: `${namespace}/${action}Fail`,
        payload
      }))
  }
}
