const NAMESPACE_SEP = '/'

function prefixNamespace(model) {
  const { namespace, reducers, epics } = model

  const newModel = { ...model }

  if (reducers) {
    newModel.reducers = prefix(namespace, reducers)
  }

  if (epics) {
    newModel.epics = prefix(namespace, epics)
  }

  return newModel
}

function prefix(namespace, obj) {
  return Object.keys(obj).reduce((memo, key) => {
    return {
      ...memo,
      [`${namespace}${NAMESPACE_SEP}${key}`]: obj[key]
    }
  }, {})
}

export default prefixNamespace
