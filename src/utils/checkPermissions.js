import { getItemFromLocal } from '@/utils/storage'

export function getUser() {
  return getItemFromLocal('userName')
}

/**
 * @description
 * @author linghu
 * @date 2020-05-09
 */
export function getUserId() {
  return getItemFromLocal('userId')
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
 * @param {*} 约定authority 系统内必须不会空  为空为登录页
 * @returns
 */
export function checkAuth(authority) {
  const isDiscrete = getItemFromLocal('threePowersSwitch') || false
  // 系统需要权限 如果没有登录
  if (!getRole() && authority) {
    return false
  }
  // 如果没有开启三员  或者没有设置权限直接return

  if (isDiscrete === false) {
    return true
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
