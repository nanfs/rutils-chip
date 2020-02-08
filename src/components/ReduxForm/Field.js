import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { getIn } from './structure'

import withContextField from './withContextField'

class Field extends React.Component {
  componentDidMount() {
    const { _reduxForm, name: field, validate } = this.props
    // 使用函数不直接返回this.props.validate的好处在于, 如果this.props.validate发生变化，取到的是最新的
    _reduxForm.register(field, () => validate)
  }

  componentWillUnmount() {
    const { _reduxForm, name: field } = this.props
    _reduxForm.unregister(field)
  }

  handleBlur = e => {
    const { _reduxForm, name: field, onBlur } = this.props
    _reduxForm.actions.blur(field)

    onBlur && onBlur(e)
  }

  handleChange = e => {
    const { _reduxForm, name: field, onChange } = this.props
    if (e && typeof e.target !== 'undefined') {
      _reduxForm.actions.change(field, e.target.value)
    } else {
      _reduxForm.actions.change(field, e)
    }
    onChange && onChange(e)
  }

  handleFocus = e => {
    const { _reduxForm, name: field, onFocus } = this.props
    _reduxForm.actions.focus(field)

    onFocus && onFocus(e)
  }

  render() {
    const {
      component: WrappedField,
      _reduxForm,
      className,
      ...other
    } = this.props

    return (
      <WrappedField
        {...other}
        className={classnames('item-control', className)}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
      />
    )
  }
}

const connector = connect((state, ownProps) => {
  const { _reduxForm, name: field } = ownProps
  const { getFormState } = _reduxForm
  const formState = getFormState(state)
  const touched = getIn(formState, `fields.${field}.touched`)
  const active = getIn(formState, `fields.${field}.active`)
  const visited = getIn(formState, `fields.${field}.visited`)
  const syncError = getIn(formState, `syncErrors.${field}`)
  const value = getIn(getIn(formState, 'values'), field)
  return {
    meta: {
      touched,
      active,
      value,
      visited,
      error: syncError
    }
  }
})

const ConnectedField = connector(Field)

ConnectedField.propTypes = {
  asyncValidate: PropTypes.func,
  component: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onAdd: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array])
}

export default withContextField(ConnectedField)
