import 'core-js/es6/map'
import 'core-js/es6/set'
import 'core-js/es6/symbol'
import 'core-js/es6/promise'
import 'core-js/es6/array'
import 'core-js/es6/object'
import 'core-js/es7/object'
// import 'whatwg-fetch'

Object.assign = require('core-js/fn/object/assign')

if (typeof requestAnimationFrame === 'undefined') {
  // eslint-disable-next-line func-names
  window.requestAnimationFrame = function(callback) {
    setTimeout(callback, 0)
  }
}
