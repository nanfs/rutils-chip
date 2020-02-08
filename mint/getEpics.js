function getEpics(namespace, epicsObj = {}) {
  return Object.keys(epicsObj).map(actionType => {
    return (action$, store) => {
      const a$ = action$.ofType(actionType).map(action => {
        const state = store.getState()
        const modelState = state[namespace]
        // eslint-disable-next-line no-param-reassign
        action.state = modelState
        return action
      })
      return epicsObj[actionType](a$, action$, store)
    }
  })
}

export default getEpics
