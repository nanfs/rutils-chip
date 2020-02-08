import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'

function observablify(fn) {
  return (...args) => Observable.fromPromise(fn(...args))
}

export default observablify
