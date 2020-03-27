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

reloadAuthorized()
export { CURRENT, USER, reloadAuthorized, setUserToLocal, getUserFromlocal }
