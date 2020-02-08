function combineNameSpaceReducers(namespaceReducers = {}, initialState = {}) {
  function dispatchAction(actionType, reducer) {
    return (state, action) => {
      if (action.type === actionType) {
        return reducer(state, action)
      }
      return state
    }
  }

  function reducerReducers(...reducers) {
    return (state, action) => {
      return reducers.reduce(
        (preState, reducer) => reducer(preState, action),
        state
      )
    }
  }

  // eslint-disable-next-line no-undef
  const actionDispatchedReducers = Object.keys(namespaceReducers).map(
    actionType => {
      const reducer = namespaceReducers[actionType]
      return dispatchAction(actionType, reducer)
    }
  )

  const combinedReducer = reducerReducers(...actionDispatchedReducers)

  return (state = initialState, action) => {
    return combinedReducer(state, action)
  }
}
export default combineNameSpaceReducers
