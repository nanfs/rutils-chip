/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createHashHistory } from 'history'

import prefixNamespace from './prefixNamespace'
import createStore from './createStore'
import createReducer from './createReducer'
import createEpic from './createEpic'
import getEpics from './getEpics'
import combineNameSpaceReducers from './combineNameSpaceReducers'
import {
  run as runSubscription,
  unlisten as unlistenSubscription
} from './subscription'

const noop = () => {}

const defaultConfig = {
  initialState: {},
  extraReducers: {},
  extraEnhancers: [],
  extraMiddlewares: [],
  stateListeners: [],
  onError: noop,
  reducerEnhancer: reducer => reducer
}

function createApp(config) {
  const history = createHashHistory()
  // 单例, 通过app来暴露接口
  const app = {
    _store: null,
    _models: [],
    _router: null,
    _history: history,
    model,
    router,
    start
  }

  const _config = {
    ...defaultConfig,
    ...config
  }

  return app

  /**
   * 在app启动之前，注册model函数
   * @param {object} m 需要注册的model
   */
  function model(m) {
    app._models.push(prefixNamespace(m))
  }

  function router(r) {
    app._router = r
  }

  function start(appSelector) {
    let epics = []
    app._reducers = {
      ..._config.extraReducers
    }
    app._asyncReducers = {}

    for (const m of app._models) {
      app._reducers[m.namespace] = combineNameSpaceReducers(m.reducers, m.state)
      epics = epics.concat(getEpics(m.namespace, m.epics))
    }

    const reducer = createReducer(app._reducers, _config.reducerEnhancer)
    const epicObj = createEpic(epics)
    const store = createStore(
      reducer,
      epicObj.rootEpic,
      _config.initialState,
      _config.extraMiddlewares,
      _config.extraEnhancers,
      history
    )
    app._store = store
    for (const listener of _config.stateListeners) {
      store.subscribe(() => {
        listener(store.getState())
      })
    }
    app.unlisteners = {}
    for (const m of this._models) {
      if (m.subscriptions) {
        app.unlisteners[m.namespace] = runSubscription(m.subscriptions, app, m)
      }
    }

    app.model = injectModel.bind(app, epicObj.addEpics)
    app.unmodel = unmodel.bind(app)

    // 如果指定appSelector， 才是真正启动
    if (appSelector) {
      const root = document.getElementById(appSelector)
      ReactDOM.render(
        <Provider store={store}>
          {app._router({ history: app._history, app })}
        </Provider>,
        root
      )
    }
  }

  function injectModel(addEpics, m) {
    const { _store: store } = app
    const _m = prefixNamespace(m)
    app._models.push(_m)
    if (_m.reducers) {
      app._asyncReducers[_m.namespace] = combineNameSpaceReducers(
        _m.reducers,
        _m.state
      )
      store.replaceReducer(
        createReducer(
          {
            ...app._reducers,
            ...app._asyncReducers
          },
          _config.reducerEnhancer
        )
      )
    }

    if (_m.epics) {
      addEpics(getEpics(_m.namespace, _m.epics))
    }

    if (_m.subscriptions) {
      app.unlisteners[_m.namespace] = runSubscription(_m.subscriptions, app, _m)
    }
  }

  function unmodel(namespace) {
    const { _store: store } = app
    // Delete reducers
    delete app._asyncReducers[namespace]
    delete app._reducers[namespace]

    store.replaceReducer(
      createReducer(
        {
          ...app._reducers,
          ...app._asyncReducers
        },
        _config.reducerEnhancer
      )
    )

    store.dispatch({ type: `${namespace}/@@CANCEL_EFFECTS` })
    unlistenSubscription(app._unlisteners, namespace)
    app._models = app._models.filter(m => m.namespace !== namespace)
  }
}

export default createApp
