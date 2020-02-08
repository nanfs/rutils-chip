/* global window */
import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { routerMiddleware } from 'react-router-redux'

export default (
  reducer,
  rootEpic,
  initialState,
  extraMiddlewares,
  extraEnhancers,
  history
) => {
  const middlewares = [
    routerMiddleware(history),
    createEpicMiddleware(rootEpic),
    ...extraMiddlewares
  ]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  let enhancers = [middlewareEnhancer, ...extraEnhancers]

  if (
    process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION__
  ) {
    enhancers = [
      ...enhancers,
      window.__REDUX_DEVTOOLS_EXTENSION__(
        window.__REDUX_DEVTOOLS_EXTENSION__OPTIONS
      )
    ]
  }

  return createStore(reducer, initialState, compose(...enhancers))
}
