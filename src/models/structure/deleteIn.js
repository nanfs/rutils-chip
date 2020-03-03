import toPath from 'lodash/toPath'
import isArrayPath from './isArrayPath'

export default function deleteIn(state, field) {
  if (typeof state !== 'object') {
    return state
  }

  const path = toPath(field)
  const len = path.length

  const newState = Array.isArray(state) ? [...state] : { ...state }
  let temp = null
  let parentState = newState

  let i = 0
  for (; i < len - 1; i++) {
    if (!isArrayPath(path[i]) && Array.isArray(parentState)) {
      throw new Error(
        `Must access array elements with a number, not "${String(path[i])}".`
      )
    }
    if (path[i] in parentState) {
      temp = parentState[path[i]]
      temp = Array.isArray(temp) ? [...temp] : { ...temp }
      parentState[path[i]] = temp
      parentState = temp
    } else {
      break
    }
  }

  const last = path[i]

  if (!isArrayPath(last) && Array.isArray(parentState)) {
    throw new Error(
      `Cannot delete non-numerical index from an array. Given: "${String(last)}`
    )
  }
  if (i < len - 1 || !(last in parentState)) {
    return state
  }

  if (Array.isArray(parentState)) {
    parentState.splice(last, 1)
  } else {
    delete parentState[last]
  }

  return newState
}
