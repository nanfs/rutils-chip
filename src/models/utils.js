import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'

function observablify(fn) {
  return (...args) => Observable.fromPromise(fn(...args))
}

// wrapResult 用于触发成功失败消息

export function request(
  namespace,
  dataIndex,
  api,
  action,
  payload,
  wrapResult = false
) {
  const obApi = observablify(api)
  return {
    type: 'global/request',
    meta: {
      namespace,
      obApi,
      dataIndex,
      action,
      starttime: +new Date(),
      wrapResult
    },
    payload
  }
}

export function cleanRequest(namespace, dataIndex) {
  return {
    type: 'global/cleanRequest',
    meta: { namespace, dataIndex }
  }
}
