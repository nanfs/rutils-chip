import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Input, Icon } from 'antd'
import './index.scss'

class NumInputField extends React.Component {
  optClick = (value, type) => {
    const { onChange, disabled } = this.props
    if (disabled) {
      return null
    }
    if (type === 'add') {
      const v = parseInt(value, 10) + 1
      return onChange(v)
    }
    const v = parseInt(value, 10) - 1
    if (v < 0) return onChange(0)
    return onChange(v)
  }

  render() {
    const {
      InputProps,
      meta: { visited, error, value = '' },
      name,
      validate,
      dispatch,
      disabled,
      defaultValue,
      ...other
    } = this.props
    const InputClassName = classnames({
      error: visited && error
    })
    const displayValue =
      typeof defaultValue !== 'undefined' ? value || defaultValue : value
    return (
      <div {...other}>
        <div {...other} className="number-input">
          <Icon
            type="minus"
            disabled={disabled}
            onClick={() => this.optClick(value, 'reduce')}
          />
          <Input
            name={name}
            value={displayValue}
            disabled={disabled}
            className={InputClassName}
            {...InputProps}
          />
          <Icon
            type="plus"
            disabled={disabled}
            onClick={() => this.optClick(value, 'add')}
          />
        </div>
        {visited && error && <span className="error-msg">{error}</span>}
        {validate &&
          validate.toString().indexOf('必填项不能为空') !== -1 &&
          (value === '' || typeof value === 'undefined') && (
            <span className="red-text">*</span>
          )}
      </div>
    )
  }
}

NumInputField.propTypes = {
  InputProps: PropTypes.object,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  validate: PropTypes.array
}

export default NumInputField
