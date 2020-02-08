import toPath from 'lodash/toPath'

// nanfs transfer field to array
export default function getIn(state, field) {
  const path = toPath(field)
  const len = path.length

  if (!len) {
    return undefined
  }

  let result = state

  for (let i = 0; i < len && result; ++i) {
    result = result[path[i]]
  }

  return result
}
