import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './fonts/iconfont'
import './fonts/iconfont.css'
import './icon.scss'

function MyIcon(props) {
  const { prefixCls, type, spin, component, className, ...other } = props
  const classes = {
    [`icon-${type}`]: type,
    'v-icon-spin': !!spin
  }
  if (component === 'svg') {
    const cls = classnames('svgicon', `icon-${type}`, className)
    const svgType = `#icon-${type}`
    return (
      <i className={prefixCls}>
        <svg className={cls} aria-hidden="true" {...other}>
          <use xlinkHref={svgType} />
        </svg>
      </i>
    )
  }
  const cls = classnames(prefixCls, 'iconfont', className, classes)
  return <i {...other} className={cls} />
}

const propTypes = {
  component: PropTypes.string.oneOf(['svg', 'font']),
  prefixCls: PropTypes.string,
  spin: PropTypes.bool,
  type: PropTypes.string.isRequired
}

const defaultProps = {
  prefixCls: 'v-icon',
  spin: false
}

MyIcon.propTypes = propTypes
MyIcon.defaultProps = defaultProps

export default MyIcon
