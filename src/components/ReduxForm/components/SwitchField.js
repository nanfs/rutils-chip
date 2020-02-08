import React from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'antd'

function SwitchField(props) {
  const {
    meta: { touched, error, value = false },
    InputProps,
    dispatch,
    disabled,
    validate,
    type,
    onChange,
    ...other
  } = props
  return (
    <React.Fragment>
      <Switch
        checked={!!value}
        disabled={disabled}
        onClick={onChange}
        onChange={onChange}
      />
      {touched && error && <div className="error-msg">{error}</div>}
    </React.Fragment>
  )
}

SwitchField.propTypes = {
  InputProps: PropTypes.object,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  validate: PropTypes.array
}

export default SwitchField
