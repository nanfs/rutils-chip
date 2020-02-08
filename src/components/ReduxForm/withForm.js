import React from 'react'
import PropTypes from 'prop-types'
import { getIn, deepEqual } from './structure'
import combineFieldValidators from './combineFieldValidators'

function withForm(WrappedForm) {
  class Form extends React.Component {
    constructor(props) {
      super(props)
      this.fieldValidatorGetters = {}
      this.lastFieldValidatorKeys = []
      this.submitPromise = null
    }

    getChildContext() {
      return {
        _reduxForm: {
          config: this.props.config,
          actions: this.props.actions,
          register: this.register,
          unregister: this.unregister,
          getFormState: state =>
            getIn(this.props.config.getFormState(state), this.props.config.form)
        }
      }
    }

    componentDidMount() {
      this.syncValidateIfNeed()
      this.initIfNeeded()
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(nextProps) {
      this.syncValidateIfNeed(nextProps)
      this.initIfNeeded(nextProps)
    }

    componentWillUnmount() {
      if (this.props.config.destroyOnUnmount) {
        this.props.actions.destory()
      }
    }

    handleSubmit = e => {
      e.preventDefault()
      if (this.props.onSubmit) {
        this.props.onSubmit(this.props.meta.values, e)
      }
    }

    getFieldValidators = () => {
      const fieldValidators = {}
      Object.keys(this.fieldValidatorGetters).forEach(field => {
        const validators = this.fieldValidatorGetters[field]()
        if (validators) {
          fieldValidators[field] = validators
        }
      })
      return fieldValidators
    }

    register = (field, validatorGetter) => {
      this.props.actions.registerField(field)
      this.fieldValidatorGetters[field] = validatorGetter
    }

    unregister = field => {
      this.props.actions.unRegisterField(field)
      delete this.fieldValidatorGetters[field]
    }

    shouldSyncValidate = nextProps => {
      const init = !nextProps

      if (init) {
        return true
      }

      const prevValues = getIn(this.props, 'meta.values')
      const nextValues = getIn(nextProps, 'meta.values')
      const fieldValidators = this.getFieldValidators()

      return (
        !deepEqual(prevValues, nextValues) ||
        !deepEqual(this.lastFieldValidators, fieldValidators)
      )
    }

    shouldUpdateSyncErrors = (nextError, nextSyncErrors, error, syncErrors) =>
      !deepEqual(nextSyncErrors, syncErrors) || !deepEqual(nextError, error)

    syncValidate = nextProps => {
      const newestProp = nextProps === undefined ? this.props : nextProps
      const { config, meta, actions } = newestProp
      const { validate: validator } = config
      const { values, error, syncErrors } = meta
      const fieldValidator = combineFieldValidators(this.getFieldValidators())

      const errors = (validator && validator(values)) || {}
      const fieldErrors = (fieldValidator && fieldValidator(values)) || {}
      const { _error: nextError, ...nextSyncErrors } = {
        ...errors,
        ...fieldErrors
      }

      if (
        this.shouldUpdateSyncErrors(
          nextError,
          nextSyncErrors,
          error,
          syncErrors
        )
      ) {
        actions.updateSyncErrors(nextError, nextSyncErrors)
      }
    }

    syncValidateIfNeed = nextProps => {
      if (this.shouldSyncValidate(nextProps)) {
        this.lastFieldValidators = this.getFieldValidators()
        this.syncValidate(nextProps)
      }
    }

    initIfNeeded = nextProps => {
      if (nextProps) {
        if (!deepEqual(this.props.initialValues, nextProps.initialValues)) {
          this.props.actions.initialize(
            nextProps.initialValues,
            nextProps.config.keepDirtyOnReinitialize
          )
        }
      } else {
        this.props.actions.initialize(
          this.props.initialValues,
          this.props.config.keepDirtyOnReinitialize
        )
      }
    }

    render() {
      const { onSubmit, ...other } = this.props
      return <WrappedForm onSubmit={this.handleSubmit} {...other} />
    }
  }
  Form.childContextTypes = {
    _reduxForm: PropTypes.object
  }
  Form.propTypes = {
    actions: PropTypes.object,
    config: PropTypes.object,
    initialValues: PropTypes.object,
    meta: PropTypes.object,
    onSubmit: PropTypes.func
  }

  return Form
}

export default withForm
