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
    (localStorage.getItem('d-user') &&
      JSON.parse(localStorage.getItem('d-user')).success) ||
    false
  )
}
export function CurrentUser() {
  return CURRENT
}
export function UserName() {
  return (
    (localStorage.getItem('d-user') &&
      JSON.parse(localStorage.getItem('d-user')).username) ||
    false
  )
}
