import React from 'react'
import classnames from 'classnames'
import './fonts/iconfont'
import './fonts/iconfont.css'
import './icon.less'

function onClick(props) {
  if (props.disabled) {
    return false
  } else {
    props.onClick && props.onClick()
  }
}
function MyIcon(props) {
  const {
    prefixCls = 'v-icon anticon',
    spin,
    component = 'svg',
    title,
    className,
    ...other
  } = props
  const type = props.type || 'vm-unknown'
  const classes = {
    [`icon-${type}`]: type,
    'v-icon-spin': !!spin
  }
  if (component === 'svg') {
    const cls = classnames('svgicon', `icon-${type}`, className)
    const svgType = `#icon-${type}`
    return (
      <i className={prefixCls} title={title}>
        <svg
          className={cls}
          aria-hidden="true"
          {...other}
          onClick={onClick.bind(this, props)}
        >
          <use xlinkHref={svgType} />
        </svg>
      </i>
    )
  }
  const cls = classnames(prefixCls, 'iconfont', className, classes)
  return (
    <i
      {...other}
      className={cls}
      title={title}
      onClick={onClick.bind(this, props)}
    />
  )
}

export default MyIcon
