import check from './CheckPermissions'

function Authorized(props) {
  const { children, authority, noMatch = null } = props
  const childrenRender = typeof children === 'undefined' ? null : children
  return check(authority, childrenRender, noMatch)
}

export default Authorized
