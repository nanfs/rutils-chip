import React from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'
import { dataToOptions } from '@/utils/tool'

function RadioField(props) {
  const {
    meta: { value, touched, error },
    InputProps,
    dispatch,
    name,
    options: preOptions,
    validate,
    onChange,
    disabled,
    ...other
  } = props
  // const cls = classnames('item-control', {
  //   required: error && error.includes('必填项不能为空'),
  // });
  const options = dataToOptions(preOptions)
  return (
    <div>
      <Radio.Group value={value} onChange={onChange} disabled={disabled}>
        {options.map(option => (
          <Radio
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
      {touched && error && <div className="error-msg">{error}</div>}
    </div>
  )
}

RadioField.propTypes = {
  name: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default RadioField
