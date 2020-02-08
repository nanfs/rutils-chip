import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Select } from 'antd'

function DynamicField(props) {
  const {
    meta: { touched, error, value = [] },
    InputProps,
    dispatch,
    name,
    options,
    validate,
    ...other
  } = props
  const InputClassName = classnames({
    error: touched && error
  })
  let displayValue = []
  if (value.indexOf('<>') !== -1) {
    displayValue = []
  } else if (Array.isArray(value)) {
    displayValue = value
  } else {
    displayValue = (value && value.split(',').map(item => +item)) || []
  }
  return (
    <div {...other} className={InputClassName}>
      <Select
        value={displayValue}
        className={InputClassName}
        multiple
        {...other}
      >
        {options.map(option => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
      {touched && error && <span className="error-msg">{error}</span>}
      {validate &&
        validate.toString().indexOf('必填项不能为空') !== -1 &&
        (!value.length || typeof value === 'undefined') &&
        value !== 0 && <span className="red-text">*</span>}
    </div>
  )
}
DynamicField.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array
}

export default DynamicField
