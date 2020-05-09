import { getItemFromLocal } from '@/utils/storage'

export function getUser() {
  return getItemFromLocal('userName')
}

/**
 * @description
 * @author lishuai
 * @date 2020-05-08
 */
export function reloadAuthorized() {
  getItemFromLocal('userName')
}

export function getRole() {
  return getItemFromLocal('userRole')
}
/**
 * @description 检查路由权限
 * @author lishuai
 * @date 2020-05-09
 * @export
 * @param {*} authority
 * @param {*} target
 * @param {*} Exception
 * @returns
 */
export function checkRoute(authority, target, Exception) {
  console.log('checkRoute', checkAuth(authority))
  if (checkAuth(authority)) {
    return target
  }
  return Exception
}

/**
 * @description 检查权限 返回boolean 如果开启三员 开始检查 没有直接返回true
 * @author lishuai
 * @date 2020-05-09
 * @export
 * @param {*} authority
 * @returns
 */
export function checkAuth(authority) {
  const isDiscrete = getItemFromLocal('threePowersSwitch')
  // 如果没有开启三员  或者没有设置权限直接return
  if (isDiscrete === false || !authority) {
    return true
  }
  if (!getRole()) {
    return false
  }
  // 数组处理
  if (Array.isArray(authority)) {
    if (authority.indexOf(getRole()) >= 0) {
      return true
    }
    return false
  }

  // string 处理
  if (typeof authority === 'string') {
    if (authority.indexOf(getRole()) !== -1) {
      return true
    }
    return false
  }

  // Function 处理
  if (typeof authority === 'function') {
    const bool = authority(getRole())
    if (bool) {
      return true
    }
    return false
  }
  return false
}
