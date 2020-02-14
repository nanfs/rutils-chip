import { CURRENT } from '@/utils/auth'

export default function Auth(props) {
  const { children, allow } = props
  const isShow = allow.indexOf(CURRENT) !== -1 ? 1 : 0
  return !!isShow && children
}

export function AuthDisable(user) {
  const isDisabled = user === CURRENT
  return isDisabled
}
export function IsOnline() {
  return (
    (sessionStorage.getItem('d-user') &&
      JSON.parse(sessionStorage.getItem('d-user')).success) ||
    false
  )
}
export function CurrentUser() {
  return CURRENT
}
export function UserName() {
  return (
    (sessionStorage.getItem('d-user') &&
      JSON.parse(sessionStorage.getItem('d-user')).username) ||
    false
  )
}
