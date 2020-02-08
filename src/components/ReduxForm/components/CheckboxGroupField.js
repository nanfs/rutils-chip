import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'antd'

function CheckboxGroupField(props) {
  const {
    meta: { value = [] },
    InputProps,
    dispatch,
    name,
    options,
    ...other
  } = props

  return (
    <Checkbox.Group value={value} {...other}>
      {options.map(option => (
        <Checkbox key={option.value} value={option.value}>
          {option.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  )
}

CheckboxGroupField.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array
}

export default CheckboxGroupField
