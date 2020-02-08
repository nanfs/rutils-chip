import * as actionTypes from './actionTypes'

export function destory(form) {
  return {
    type: actionTypes.destory,
    meta: {
      form
    }
  }
}

export function registerField(form, field) {
  return {
    type: actionTypes.registerField,
    meta: {
      form,
      field
    }
  }
}

export function unRegisterField(form, field) {
  return {
    type: actionTypes.unRegisterField,
    meta: {
      form,
      field
    }
  }
}

export function blur(form, field, touch) {
  return {
    type: actionTypes.blur,
    meta: {
      form,
      field,
      touch
    }
  }
}

export function focus(form, field) {
  return {
    type: actionTypes.focus,
    meta: {
      form,
      field
    }
  }
}
export function change(form, field, value, touch) {
  return {
    type: actionTypes.change,
    meta: {
      form,
      field,
      touch
    },
    payload: value
  }
}
export function updateSyncErrors(form, error, syncErrors) {
  return {
    type: actionTypes.updateSyncErrors,
    meta: {
      form
    },
    payload: {
      error,
      syncErrors
    }
  }
}
export function initialize(form, values, keepDirty) {
  return {
    type: actionTypes.initialize,
    meta: {
      form,
      keepDirty
    },
    payload: values
  }
}
