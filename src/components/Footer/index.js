import React from 'react'
import classnames from 'classnames'
import styles from './index.m.scss'

export default props => {
  const { className: classNameProp, ...other } = props

  const className = classnames(styles.footer, classNameProp)
  return (
    <div {...other} className={className}>
      中国电子科技网络信息安全有限公司 版权所有
    </div>
  )
}
