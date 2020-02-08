/* eslint-disable import/no-mutable-exports */
// TODO cpfrom auth
let CURRENT = 'NULL'
let USER = {}
function getUserFromlocal() {
  return JSON.parse(localStorage.getItem('d-user')) || {}
}

const reloadAuthorized = () => {
  const user = getUserFromlocal()
  // 在这里修改获取用户的权限类型
  const currentAuthority = user.roleTag
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
  user = user || {}
  return localStorage.setItem('d-user', JSON.stringify(user))
}

reloadAuthorized()

export { CURRENT, USER, reloadAuthorized, setUserToLocal, getUserFromlocal }
