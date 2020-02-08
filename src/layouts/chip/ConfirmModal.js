import React from 'react'
import { connect } from 'react-redux'
import Icon from 'violet-ui/components/Icon'
import Button from 'violet-ui/components/Button'
import Dialog, {
  DialogHeader,
  DialogBody,
  DialogFooter
} from 'd-virt/src/components/Dialog'
import { ArrayObjMsgToList, TextOutFormat } from '../../utils/textOpt'

class ConfirmModal extends React.Component {
  handleActtion = confirmBox => {
    this.props.dispatch({
      type: confirmBox.action,
      payload: confirmBox.payload
    })
    this.props.dispatch({
      type: 'app/closeConfirm'
    })
  }

  handleClose = () => {
    this.props.dispatch({
      type: 'app/closeConfirm'
    })
  }

  render() {
    const { loginOutShow } = this.props
    let { confirmBox } = this.props
    confirmBox = confirmBox || {}
    const classProp =
      confirmBox && confirmBox.size
        ? `top-modal modal-${confirmBox.size}`
        : 'top-modal modal-sm'
    const contentMsg =
      confirmBox &&
      confirmBox.msg &&
      (Array.isArray(confirmBox.msg)
        ? ArrayObjMsgToList(confirmBox.msg)
        : TextOutFormat(confirmBox.msg, confirmBox.msgType))
    return (
      <Dialog
        open={loginOutShow || !!(confirmBox && Object.keys(confirmBox).length)}
        onClose={this.handleActtion.bind(null, confirmBox)}
        className={classProp}
      >
        <DialogHeader
          onClose={
            confirmBox.action === 'app/logout'
              ? this.handleActtion.bind(null, confirmBox)
              : this.handleClose
          }
        >
          <Icon type="light" />
          {confirmBox.title}
        </DialogHeader>
        <DialogBody className="msg-box">{contentMsg}</DialogBody>
        <DialogFooter className="modal-btns-wrap form-opt-btn">
          <Button
            onClick={this.handleActtion.bind(null, confirmBox)}
            size={confirmBox.size || 'md'}
            type="default"
          >
            {confirmBox.button}
          </Button>
          {confirmBox.showClose === 'show' && (
            <Button
              onMouseDown={this.handleClose}
              size={confirmBox.size || 'md'}
            >
              取消
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    )
  }
}

export default connect(({ app }) => {
  const { loginOutShow, confirmBox } = app
  return {
    loginOutShow,
    confirmBox
  }
})(ConfirmModal)
