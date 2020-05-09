/* eslint-disable import/no-mutable-exports */
let CURRENT = 'NULL'
let USER = {}
function getUserFromlocal() {
  return JSON.parse(sessionStorage.getItem('d-user')) || {}
}

const reloadAuthorized = () => {
  const user = getUserFromlocal()
  // 在这里修改获取用户的权限类型
  const currentAuthority = user
  USER = user
  if (currentAuthority) {
    if (currentAuthority.constructor === Function) {
      CURRENT = currentAuthority()
    }
    if (currentAuthority.constructor === String) {
      CURRENT = currentAuthority
    }
  } else {
    CURRENT = 'NULL'
  }
}

function setUserToLocal(user) {
  if (user) {
    sessionStorage.setItem('d-user', JSON.stringify(user))
  } else {
    sessionStorage.removeItem('d-user')
  }
}

/**
 * @description 获取项目参数
 * @author lishuai
 * @date 2020-05-07
 * @returns
 */
function getPropertieslocal() {
  return JSON.parse(sessionStorage.getItem('properties')) || {}
}

/**
 * @description 设置项目参数
 * @author lishuai
 * @date 2020-05-07
 * @param {*} properties
 */
function setPropertiesToLocal(properties) {
  if (properties) {
    sessionStorage.setItem('properties', JSON.stringify(properties))
  } else {
    sessionStorage.removeItem('properties')
  }
}
reloadAuthorized()
export {
  CURRENT,
  USER,
  reloadAuthorized,
  setUserToLocal,
  getPropertieslocal,
  setPropertiesToLocal,
  getUserFromlocal
}
