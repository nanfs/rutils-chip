export function required(rule, value, callback) {
  console.log(value)
  if (value === undefined || value === null || value.length === 0) {
    callback(new Error('这是必填项'))
  }
  callback()
}

export function moreThanValue(min) {
  return (rule, value, callback) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      !Number.isNaN(value * 1.0)
    ) {
      if (value * 1.0 <= min) {
        callback(new Error(`值不能小于等于${min}`))
      }
    }
    callback()
  }
}

export function minLength(min) {
  return (rule, value, callback) => {
    if (value !== undefined && value !== null && value !== '') {
      if (value.length < min) {
        callback(new Error(`长度不能小于${min}`))
      }
    }
    callback()
  }
}

export function notSame(propValue, prop) {
  return (rule, value, callback) => {
    if (value !== undefined && value !== null && value !== '') {
      if (value === propValue) {
        callback(new Error(`不能和${prop}相同`))
      }
    }
    callback()
  }
}
