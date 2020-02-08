import React from 'react'
import { connect } from 'react-redux'
import Icon from 'violet-ui/components/Icon'
import Dialog, { DialogHeader, DialogBody } from '../Dialog'
import SetPwdForm from './SetPwdForm'

class PwdModal extends React.Component {
  handleClose = e => {
    e.preventDefault()
    this.props.dispatch({
      type: 'app/closeSetPwd'
    })
  }

  handleUpdate = (e, pwd) => {
    if (pwd.repwd !== pwd.pwd) {
      this.props.dispatch({
        type: 'app/openTips',
        payload: '两次输入的新密码不一致!'
      })
      return false
    }
    if (pwd.oldPwd === pwd.pwd) {
      this.props.dispatch({
        type: 'app/openTips',
        payload: '新密码和旧密码不能相同!'
      })
      return false
    } else {
      this.props.dispatch({
        type: 'app/setPwd',
        payload: pwd
      })
    }
  }

  render() {
    const { showSetPwd, pwdUpdatting } = this.props
    return (
      <Dialog
        open={showSetPwd}
        onClose={this.handleClose}
        className="pwd-dailog"
      >
        <DialogHeader onClose={this.handleClose}>
          <Icon type="jurisdiction" />
          修改密码
        </DialogHeader>
        <DialogBody>
          <SetPwdForm
            loading={pwdUpdatting.loading}
            error={pwdUpdatting.message}
            onSubmit={this.handleUpdate}
            onClose={this.handleClose}
          />
        </DialogBody>
      </Dialog>
    )
  }
}

export default connect(({ app, global }) => {
  const { showSetPwd } = app
  const {
    data: { 'app/pwdupdatting': pwdUpdatting = {} }
  } = global
  return {
    showSetPwd,
    pwdUpdatting
  }
})(PwdModal)
