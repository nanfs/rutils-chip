/* eslint-disable no-plusplus */
export function required(rule, value, callback) {
  if (value === undefined || value === null || value.length === 0) {
    return callback(new Error('这是必填项'))
  }
  callback()
}
export function isInt(rule, value, callback) {
  const re = new RegExp('^(\\-)?([1-9]{1}[0-9]*|[0-9])$')
  if (value && !re.test(value)) {
    callback(new Error('请填写整数'))
  }
  callback()
}
export function notUndefined(rule, value, callback) {
  if (value === undefined) {
    return callback(new Error('这是必填项'))
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
      if (value * 1.0 < min) {
        callback(new Error(`值不能小于${min}`))
      }
    }
    callback()
  }
}
export function lessThanValue(max) {
  return (rule, value, callback) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      !Number.isNaN(value * 1.0)
    ) {
      if (value * 1.0 > max) {
        callback(new Error(`值不能大于${max}`))
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
export function textRange(min = 0, max) {
  return (rule, value, callback) => {
    if (value !== undefined && value !== null && value !== '') {
      if (value.length > max) {
        callback(new Error(`最多输入${max}个字符`))
      }
      if (value.length < min) {
        callback(new Error(`最少输入${min}个字符`))
      }
    }
    callback()
  }
}

export function checkEmail(rule, value, callback) {
  const re = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)$')
  if (value && !re.test(value)) {
    callback(new Error('邮箱格式错误'))
  }
  callback()
}

export function checkName(rule, value, callback) {
  const re = new RegExp('^[\u4e00-\u9fffa-zA-Z\\d\\.\\-_]*$')
  if (value && !re.test(value)) {
    callback(new Error('请填写中文、字母、数字、"."、"-"、"_"'))
  }
  if (value && value.length > 40) {
    callback(new Error('输入名称长度限定最多40个字符'))
  }
  callback()
}

export function nameReg(rule, value, callback) {
  const re = new RegExp('^[\u4e00-\u9fffa-zA-Z\\d\\.\\-_]*$')
  if (value && !re.test(value)) {
    callback(new Error('请填写中文、字母、数字、"."、"-"、"_"'))
  }
  callback()
}

export function checkTreeNodeName(rule, value, callback) {
  const re = new RegExp('^[\u4e00-\u9fffa-zA-Z\\d\\.\\-_()（）]*$')
  if (value && !re.test(value)) {
    callback(new Error('请填写中文、字母、数字、中英文括号、"."、"-"、"_"'))
  }
  if (value && value.length > 40) {
    callback(new Error('输入名称长度限定最多40个字符'))
  }
  callback()
}

export function checkKeyId(rule, value, callback) {
  const re = new RegExp('^[A-Za-z0-9-_]+$')
  if (value && !re.test(value)) {
    callback(new Error('请填写字母、数字、"-"、"_"'))
  }
  callback()
}

export function sessionTime(rule, value, callback) {
  if (value === 0 || value < -1 || value > 10080) {
    callback(new Error('请输入-1~10080非零的整数'))
  }
  callback()
}

export function number4(rule, value, callback) {
  const re = new RegExp('^[0-9ABCDEF]{4}$')
  if (value && !re.test(value)) {
    callback(new Error('请输入由0-9，ABCDEF组成的4位16进制数'))
  }
  callback()
}

export function checkPassword(rule, value, callback) {
  if (!value) {
    return callback()
  }
  if (value.length < 10 || value.length > 20) {
    callback(new Error('输入长度限制为10-20位'))
  }
  let strong = 0
  if (value.match(/([A-Z])+/)) {
    strong++
  }
  if (value.match(/([a-z])+/)) {
    strong++
  }
  if (value.match(/([0-9])+/)) {
    strong++
  }
  if (
    value.match(
      /([~`@#%&_=<>!",;'\\$\\^\\*\\-\\+\\|\\?\\/\\(\\)\\{\\}\\"\\.])+/
    ) ||
    value.indexOf(' ') !== -1
  ) {
    strong++
  }
  if (strong < 3) {
    callback(new Error('字母、数字、特殊字符的三种组合及以上'))
  }
  callback()
}
export function number5(rule, value, callback) {
  if (value && value.length > 50) {
    callback(new Error('输入描述长度限定最多50个字符'))
  }
  callback()
}

export function version(rule, value, callback) {
  const re = new RegExp(
    '^([1-9]{1}[0-9]{0,1}|[1-9]{1})\\.([1-9]{1}[0-9]{0,1}|[0-9]{1})\\.([1-9]{1}[0-9]{0,1}|[0-9]{1})$'
  )
  if (value && !re.test(value)) {
    callback(new Error('格式为A.X.X，A为1-99的数字，X为0-99的数字'))
  }
  callback()
}
