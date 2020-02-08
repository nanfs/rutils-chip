import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Upload, Button, Icon } from 'antd'

function UploadField(props) {
  const {
    meta: { touched, error, value = '' },
    InputProps,
    dispatch,
    name,
    disabled,
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
      <Upload {...other} {...InputProps} className={cls} disabled={disabled}>
        <Button>
          <Icon type="plus" />
          选择文件
        </Button>
      </Upload>
      {touched && error && <span className="error-msg">{error}</span>}
      <div className="error-msg">{renderError}</div>
    </div>
  )
}

UploadField.propTypes = {
  InputProps: PropTypes.object,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  validate: PropTypes.array
}

export default UploadField
