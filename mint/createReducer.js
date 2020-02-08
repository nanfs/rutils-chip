import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

function createReducer(reducers, reducerEnhancer) {
  return reducerEnhancer(
    combineReducers({
      ...reducers,
      routing: routerReducer
    })
  )
}

export default createReducer
