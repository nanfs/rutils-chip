import React from 'react'
import Modalx from './index'

class ModalForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  onOk = () => {
    console.log(this.form)
  }

  render() {
    const { onRef } = this.props
    const setFormRef = ref => {
      this.content = ref
    }
    return (
      <Modalx onRef={onRef} onOk={this.onOk} title={'modal'}>
        {React.cloneElement(this.props.children, { onRef: setFormRef })}
      </Modalx>
    )
  }
}
export default ModalForm
