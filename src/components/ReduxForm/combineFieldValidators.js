import * as structure from './structure'

// eslint-disable-next-line consistent-return
function getError(value, values, field, validator) {
  validator = Array.isArray(validator) ? validator : [validator]
  for (let i = 0; i < validator.length; i++) {
    const error = validator[i](value, values, field)
    if (error) {
      return error
    }
  }
}

function combineFieldValidators(fieldValidators) {
  return values => {
    let errors = {}
    Object.keys(fieldValidators).forEach(field => {
      const value = structure.getIn(values, field)
      const validator = structure.getIn(fieldValidators, field)
      const error = getError(value, values, field, validator)
      if (error) {
        errors = structure.setIn(errors, field, error)
      }
    })
    return errors
  }
}

export default combineFieldValidators
