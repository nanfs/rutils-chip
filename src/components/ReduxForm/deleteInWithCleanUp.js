import toPath from 'lodash/toPath'
import * as structure from './structure'

const { getIn, deleteIn, setIn, deepEqual, empty } = structure

function deleteInWithCleanUp(state, field) {
  // 删除的是一个数组中的数据
  if (field[field.length - 1] === ']') {
    const path = toPath(field)
    path.pop()
    const parent = getIn(state, path.join('.'))

    return parent ? setIn(state, field, undefined) : state
  }

  let result = state
  if (getIn(state, field) !== undefined) {
    result = deleteIn(state, field)
  }

  const iDot = field.lastIndexOf('.')
  if (iDot > 0) {
    const parentPath = field.substring(0, iDot)
    if (parentPath[parentPath.length - 1] !== ']') {
      const parent = getIn(result, parentPath)
      if (deepEqual(parent, empty)) {
        return deleteInWithCleanUp(result, parentPath)
      }
    }
  }
  return result
}

export default deleteInWithCleanUp
