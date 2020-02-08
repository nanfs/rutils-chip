import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Select } from 'antd'
import { dataToOptions } from '@/utils/tool'

function SelectField(props) {
  const {
    meta: { touched, error, value = [] },
    InputProps,
    className,
    dispatch,
    name,
    validate,
    options: preOptions,
    onChange,
    mode,
    ...other
  } = props
  const options = dataToOptions(preOptions)
  const cls = classnames(className, {
    error,
    required: error && error.includes('必填项不能为空')
  })

  const InputClassName = classnames({
    error: touched && error
  })
  // TODO 添加加载状态
  return (
    <div className={cls}>
      <Select
        value={value}
        className={InputClassName}
        onChange={onChange}
        placeholder="请选择"
        mode={mode}
        {...other}
      >
        {options.map(option => (
          <Select.Option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </Select.Option>
        ))}
      </Select>
      {touched && error && <div className="error-msg">{error}</div>}
    </div>
  )
}
SelectField.propTypes = {
  name: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
}

export default SelectField
