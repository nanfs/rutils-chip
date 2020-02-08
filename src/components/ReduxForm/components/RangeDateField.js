import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { DatePicker } from 'antd'

function RangeDateField(props) {
  const {
    meta: { touched, error, value = '' },
    InputProps,
    dispatch,
    name,
    disabled,
    validate,
    defaultValue,
    onChange,
    ...other
  } = props
  // const displayValue = value.indexOf('<>') === -1 ? '' : value;
  const cls = classnames({
    error: touched && error,
    required: error && error.includes('必填项不能为空')
  })
  let renderError = null
  if (value || error) {
    renderError = error === '必填项不能为空' ? null : error
  }
  const rangeCalendar = <DatePicker.RangePicker />
  return (
    <div {...other}>
      <DatePicker
        value={value}
        disabled={disabled}
        calendar={rangeCalendar}
        className={cls}
        onChange={onChange}
        format="YYYY年MM月DD日"
        {...InputProps}
      />
      {touched && error && <span className="error-msg">{error}</span>}
      <div className="error-msg">{renderError}</div>
    </div>
  )
}

RangeDateField.propTypes = {
  InputProps: PropTypes.object,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  validate: PropTypes.array
}

export default RangeDateField
