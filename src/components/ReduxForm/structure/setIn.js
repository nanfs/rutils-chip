import toPath from 'lodash/toPath'
import isArrayPath from './isArrayPath'

export default function SetIn(state, field, value) {
  const path = toPath(field)
  const len = path.length

  let newtState = null

  if (isArrayPath(path[0])) {
    newtState = state == null ? [] : [...state]
  } else {
    newtState = state == null ? {} : { ...state }
  }

  let i = 1
  let temp = null
  let parentState = newtState

  for (; i < len; i++) {
    const isAarryIndex = isArrayPath(path[i])
    temp = parentState[path[i - 1]]
    if (isAarryIndex) {
      parentState[path[i - 1]] = temp == null ? [] : [...temp]
    } else {
      parentState[path[i - 1]] = temp == null ? {} : { ...temp }
    }
    parentState = parentState[path[i - 1]]
  }

  parentState[path[i - 1]] = value

  return newtState
}
