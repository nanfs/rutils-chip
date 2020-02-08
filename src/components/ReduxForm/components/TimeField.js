import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { TimePicker } from 'antd'
import moment from 'moment'

function TimeField(props) {
  const {
    meta: { touched, error, value },
    InputProps,
    dispatch,
    name,
    disabled,
    validate,
    defaultOpenValue,
    onChange,
    format,
    ...other
  } = props
  const cls = classnames({
    error: touched && error,
    required: error && error.includes('必填项不能为空')
  })
  return (
    <div {...other}>
      <TimePicker
        value={value ? moment(value, format) : null}
        disabled={disabled}
        format={format}
        defaultOpenValue={defaultOpenValue}
        onChange={onChange}
        className={cls}
        allowClear={false}
      />
      {touched && error && <div className="error-msg">{error}</div>}
    </div>
  )
}

TimeField.propTypes = {
  InputProps: PropTypes.object,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  validate: PropTypes.array
}

export default TimeField
