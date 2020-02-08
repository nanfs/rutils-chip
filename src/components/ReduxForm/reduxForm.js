import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import mapValues from 'lodash/mapValues'
import withForm from './withForm'
import * as importedActions from './actions'
import { getIn, deepEqual } from './structure'

const {
  change: changeAction,
  blur: blurAction,
  ...formActions
} = importedActions

const defaultConfig = {
  destroyOnUnmount: true,
  getFormState: state => getIn(state, 'form'),
  touchOnChange: false,
  touchOnBlur: true,
  keepDirtyOnReinitialize: false
}

const conneter = connect(
  (state, ownProps) => {
    const {
      config: { form, getFormState }
    } = ownProps

    const formState = getIn(getFormState(state) || {}, form) || {}
    const values = getIn(formState, 'values') || {}
    const initialValues = getIn(formState, 'initial') || {}
    const syncErrors = getIn(formState, 'syncErrors') || {}
    const error = getIn(formState, 'error')
    const touched = getIn(formState, 'anyTouch')
    const pristine = deepEqual(values, initialValues)
    const valid = !syncErrors
    return {
      meta: {
        valid,
        pristine,
        touched,
        values,
        error,
        syncErrors
      }
    }
  },
  (dispatch, ownProps) => {
    const {
      config: { form, touchOnChange, touchOnBlur }
    } = ownProps

    function bindForm(actionCreator) {
      return actionCreator.bind(null, form)
    }
    function boundChange(field, value) {
      dispatch(changeAction(form, field, value, !!touchOnChange))
    }

    function boundBlur(field) {
      dispatch(blurAction(form, field, !!touchOnBlur))
    }
    // mapValues 相当于对象的map方法
    const boundFormACs = mapValues(formActions, bindForm)

    // 绑定dispatch
    const connectedFormACs = bindActionCreators(boundFormACs, dispatch)
    return {
      actions: {
        ...connectedFormACs,
        change: boundChange,
        blur: boundBlur
      }
    }
  }
)

function reduxForm(_config) {
  const config = {
    ...defaultConfig,
    ..._config
  }

  return WrappedForm => {
    const Form = withForm(WrappedForm)
    const ConnectedForm = conneter(Form)

    ConnectedForm.propTypes = {
      config: PropTypes.object,
      initialValues: PropTypes.object,
      onSubmit: PropTypes.func
    }
    ConnectedForm.defaultProps = {
      config,
      initialValues: {}
    }
    return ConnectedForm
  }
}

export default reduxForm
