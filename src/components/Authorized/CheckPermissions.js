import { getUserFromlocal } from '@/utils/auth'

const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority) {
    return target
  }
  // 数组处理
  if (Array.isArray(authority)) {
    if (authority.indexOf(currentAuthority) >= 0) {
      return target
    }
    return Exception
  }

  // string 处理
  if (typeof authority === 'string') {
    if (authority.indexOf(currentAuthority) !== -1) {
      return target
    }
    return Exception
  }

  // Function 处理
  if (typeof authority === 'function') {
    const bool = authority(currentAuthority)
    if (bool) {
      return target
    }
    return Exception
  }
}
const check = (authority, target, Exception) =>
  checkPermissions(authority, getUserFromlocal(), target, Exception)

export default check
