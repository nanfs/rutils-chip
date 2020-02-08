import prefixedDispatch from './prefixedDispatch'

export function run(subscriptions, app, model) {
  const unlisteners = []
  Object.keys(subscriptions).forEach(subscriptionName => {
    const listener = subscriptions[subscriptionName]
    const unlistener = listener({
      history: app._history,
      dispatch: prefixedDispatch(app._store.dispatch, model)
    })

    if (typeof unlistener === 'function') {
      unlisteners.push(unlistener)
    }
  })

  return unlisteners
}

export function unlisten(unlisteners, namespace) {
  for (const unlistener of unlisteners[namespace]) {
    unlistener()
  }

  delete unlisteners[namespace]
}
