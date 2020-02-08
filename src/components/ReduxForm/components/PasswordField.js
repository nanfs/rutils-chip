import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Input } from 'antd'

function PasswordField(props) {
  const {
    meta: { error, value = '', visited, active },
    meta,
    InputProps,
    className,
    dispatch,
    inputstyle,
    name,
    disabled,
    validate,
    inputType,
    defaultValue,
    ...other
  } = props
  const cls = classnames(className, {
    error: visited && !active && error,
    required: error && error.includes('必填项不能为空')
  })
  let renderError = null
  // 当有值(这里是字符串) 访问过才不会判断是否显示错误信息
  // 过滤: 当前正在访问 而且错误信息是必填项错误信息
  if (value || (error && visited)) {
    renderError = active && error === '必填项不能为空' ? null : error
  }
  return (
    <div className={cls}>
      <Input.Password
        value={value === null ? '' : value}
        name={name}
        disabled={disabled}
        {...InputProps}
        {...other}
      />
      <div className="error-msg">{renderError}</div>
    </div>
  )
}

const propTypes = {
  InputProps: PropTypes.object,
  InputType: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
const defaultProps = {}

PasswordField.propTypes = propTypes
PasswordField.defaultProps = defaultProps
export default PasswordField
