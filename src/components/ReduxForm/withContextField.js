import React from 'react'
import PropTypes from 'prop-types'

function withReduxFormContext(Wrapped) {
  class Wrapper extends React.PureComponent {
    render() {
      const { _reduxForm } = this.context
      return <Wrapped {...this.props} _reduxForm={_reduxForm} />
    }
  }

  Wrapper.contextTypes = {
    _reduxForm: PropTypes.object.isRequired
  }

  return Wrapper
}

export default withReduxFormContext
