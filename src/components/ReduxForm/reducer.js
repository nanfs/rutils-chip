/* eslint-disable no-undef */
import deleteInWithCleanUp from './deleteInWithCleanUp'
import * as actionTypes from './actionTypes'
import { getIn, setIn, deleteIn, keys, empty, deepEqual } from './structure'

function isReduxFormAction(action) {
  return (
    action &&
    action.type &&
    action.type.length > actionTypes.prefix.length &&
    action.type.substring(0, actionTypes.prefix.length) === actionTypes.prefix
  )
}

const behaviors = {
  [actionTypes.registerField]: (state, { meta: { field, isAsync } }) => {
    let result = state

    let fieldState = getIn(result, `registeredFields.${field}`)
    if (fieldState) {
      const count = getIn(fieldState, 'count')
      fieldState = setIn(fieldState, 'count', count + 1)
    } else {
      fieldState = {
        name: field,
        count: 1
      }
    }
    result = setIn(result, `registeredFields.${field}`, fieldState)

    if (isAsync) {
      result = setIn(result, `asyncFields.${field}`, 'pending')
    }
    return result
  },
  [actionTypes.unRegisterField]: (state, { meta: { field } }) => {
    let result = state
    if (Array.isArray(field)) {
      field.forEach(item => {
        result = deleteIn(result, `registeredFields.${item}`)
        result = deleteIn(result, `asyncFields.${item}`)
        // result = deleteIn(result, `values.${item}`);
      })
    } else {
      result = deleteIn(result, `registeredFields.${field}`)
      result = deleteIn(result, `asyncFields.${field}`)
      // result = deleteIn(result, `values.${field}`);
    }
    return result
  },

  [actionTypes.blur]: (state, { meta: { field, touch } }) => {
    let result = state
    if (field === getIn(result, 'active')) {
      result = deleteIn(result, 'active')
    }
    result = deleteIn(result, `fields.${field}.active`)
    if (touch) {
      result = setIn(result, `fields.${field}.touched`, true)
      result = setIn(result, 'anyTouched', true)
    }
    return result
  },
  [actionTypes.focus]: (state, { meta: { field } }) => {
    let result = state
    const previouslyActive = getIn(state, 'active')
    result = deleteIn(result, `fields.${previouslyActive}.active`)
    result = setIn(result, `fields.${field}.visited`, true)
    result = setIn(result, `fields.${field}.active`, true)
    result = setIn(result, 'active', field)
    return result
  },
  [actionTypes.change]: (state, { meta: { field, touch }, payload }) => {
    let result = state
    const initial = getIn(result, `initial.${field}`)
    if (initial === undefined && payload === '') {
      result = deleteInWithCleanUp(result, `values.${field}`)
    } else if (payload !== undefined) {
      result = setIn(result, `values.${field}`, payload)
    }

    const asyncFields = getIn(result, 'asyncFields')
    if (getIn(asyncFields, field)) {
      result = setIn(result, `asyncFields.${field}`, 'pending')
      result = deleteIn(result, `asyncErrors.${field}`, 'pending')
    }

    if (touch) {
      result = setIn(result, `fields.${field}.touched`, true)
      result = setIn(result, 'anyTouched', true)
    }
    return result
  },
  [actionTypes.updateSyncErrors]: (
    state,
    { payload: { syncErrors, error } }
  ) => {
    let result = state
    if (error) {
      result = setIn(result, 'error', error)
      result = setIn(result, 'syncError', true)
    } else {
      result = deleteIn(result, 'error')
      result = deleteIn(result, 'syncError')
    }
    if (Object.keys(syncErrors).length) {
      result = setIn(result, 'syncErrors', syncErrors)
    } else {
      result = deleteIn(result, 'syncErrors')
    }
    return result
  },
  [actionTypes.initialize]: (
    state,
    {
      payload,
      meta: {
        keepDirty,
        keepSubmitSucceeded,
        updateUnregisteredFields,
        keepValues
      }
    }
  ) => {
    const mapData = payload
    let result = empty // clean all field state

    // persist old errors, they will get recalculated if the new form values are different from the old values
    const error = getIn(state, 'error')
    if (error) {
      result = setIn(result, 'error', error)
    }
    const syncErrors = getIn(state, 'syncErrors')
    if (syncErrors) {
      result = setIn(result, 'syncErrors', syncErrors)
    }

    const registeredFields = getIn(state, 'registeredFields')
    if (registeredFields) {
      result = setIn(result, 'registeredFields', registeredFields)
    }

    const previousValues = getIn(state, 'values')
    const previousInitialValues = getIn(state, 'initial')

    let newInitialValues = mapData
    let newValues = previousValues

    if (keepDirty && registeredFields) {
      if (!deepEqual(newInitialValues, previousInitialValues)) {
        //
        // Keep the value of dirty fields while updating the value of
        // pristine fields. This way, apps can reinitialize forms while
        // avoiding stomping on user edits.
        //
        // Note 1: The initialize action replaces all initial values
        // regardless of keepDirty.
        //
        // Note 2: When a field is dirty, keepDirty is enabled, and the field
        // value is the same as the new initial value for the field, the
        // initialize action causes the field to become pristine. That effect
        // is what we want.
        //
        const overwritePristineValue = name => {
          const previousInitialValue = getIn(previousInitialValues, name)
          const previousValue = getIn(previousValues, name)

          if (deepEqual(previousValue, previousInitialValue)) {
            // Overwrite the old pristine value with the new pristine value
            const newInitialValue = getIn(newInitialValues, name)

            // This check prevents any 'setIn' call that would create useless
            // nested objects, since the path to the new field value would
            // evaluate to the same (especially for undefined values)
            if (getIn(newValues, name) !== newInitialValue) {
              newValues = setIn(newValues, name, newInitialValue)
            }
          }
        }

        if (!updateUnregisteredFields) {
          forEach(keys(registeredFields), name => overwritePristineValue(name))
        }

        forEach(keys(newInitialValues), name => {
          const previousInitialValue = getIn(previousInitialValues, name)
          if (typeof previousInitialValue === 'undefined') {
            // Add new values at the root level.
            const newInitialValue = getIn(newInitialValues, name)
            newValues = setIn(newValues, name, newInitialValue)
          }

          if (updateUnregisteredFields) {
            overwritePristineValue(name)
          }
        })
      }
    } else {
      newValues = newInitialValues
    }

    if (keepValues) {
      forEach(keys(previousValues), name => {
        const previousValue = getIn(previousValues, name)

        newValues = setIn(newValues, name, previousValue)
      })

      forEach(keys(previousInitialValues), name => {
        const previousInitialValue = getIn(previousInitialValues, name)

        newInitialValues = setIn(newInitialValues, name, previousInitialValue)
      })
    }

    if (keepSubmitSucceeded && getIn(state, 'submitSucceeded')) {
      result = setIn(result, 'submitSucceeded', true)
    }
    result = setIn(result, 'values', newValues)
    result = setIn(result, 'initial', newInitialValues)
    return result
  },
  [actionTypes.reset]: state => {
    let result = empty
    const registeredFields = getIn(state, 'registeredFields')
    if (registeredFields) {
      result = setIn(result, 'registeredFields', registeredFields)
    }
    const values = getIn(state, 'initial')
    if (values) {
      result = setIn(result, 'values', values)
      result = setIn(result, 'initial', values)
    }
    return result
  }
}

function reducer(state, action) {
  const behavior = behaviors[action.type]
  return behavior ? behavior(state, action) : state
}

/**
 * 取出form, 细分state
 */
// eslint-disable-next-line no-shadow
function byForm(reducer) {
  return (state = {}, action) => {
    const form = action && action.meta && action.meta.form
    if (!form || !isReduxFormAction(action)) {
      return state
    }

    if (action.type === actionTypes.destory) {
      return deleteInWithCleanUp(state, form)
    }

    // state为 bigState.form(bigState为应用的总的state)
    // forrmState为bigState.form.formName
    const formState = getIn(state, form)

    // 得到的是新的bigState.form.formName
    const result = reducer(formState, action)

    // 如果改变则设置
    return result === formState ? state : setIn(state, form, result)
  }
}

const reduxFormReducer = byForm(reducer)

export default reduxFormReducer
