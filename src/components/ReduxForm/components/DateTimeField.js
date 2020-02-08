import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { DatePicker } from 'antd'
import moment from 'moment'

// import { dateFormat } from '@/utils/tool'
// TODO 暂时没有必填

function DateTimeField(props) {
  const {
    meta: { touched, error, value, format = 'YYYY/MM/DD', showTime = false },
    dispatch,
    name,
    validate,
    ...other
  } = props
  const cls = classnames({
    error: touched && error,
    required: error && error.includes('必填项不能为空')
  })
  let renderError = null
  if (value || error) {
    renderError = error === '必填项不能为空' ? null : error
  }
  return (
    <div>
      <DatePicker
        showTime={showTime}
        format={format}
        value={value ? moment(value) : null}
        className={cls}
        {...other}
      />
      {touched && error && <span className="error-msg">{error}</span>}
      <div className="error-msg">{renderError}</div>
    </div>
  )
}

DateTimeField.propTypes = {
  InputProps: PropTypes.object,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  validate: PropTypes.array
}

export default DateTimeField
