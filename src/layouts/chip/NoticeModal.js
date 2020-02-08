import React from 'react'
import { connect } from 'react-redux'
import Icon from 'violet-ui/components/Icon'
import Button from 'violet-ui/components/Button'
import Dialog, { DialogHeader, DialogBody, DialogFooter } from '../Dialog'
import { ArrayObjMsgToList, TextOutFormat } from '../../utils/textOpt'

class NoticeModal extends React.Component {
  handleClose = e => {
    e.preventDefault()
    this.props.dispatch({
      type: 'app/closeNotice'
    })
  }

  render() {
    const { noticeShow, noticeMsg } = this.props
    const contentMsg =
      noticeMsg &&
      (Array.isArray(noticeMsg)
        ? ArrayObjMsgToList(noticeMsg)
        : TextOutFormat(noticeMsg))
    return (
      <Dialog
        open={noticeShow}
        onClose={this.handleClose}
        className="notice-modal"
      >
        <DialogHeader onClose={this.handleClose}>
          <Icon type="light" />
          提示信息
        </DialogHeader>
        <DialogBody className="msg-box">{contentMsg}</DialogBody>
        <DialogFooter className="form-opt-btn modal-btns-wrap">
          <Button onClick={this.handleClose} size="md" type="default">
            确定
          </Button>
        </DialogFooter>
      </Dialog>
    )
  }
}

export default connect(({ app }) => {
  const { noticeShow, noticeMsg } = app
  return {
    noticeShow,
    noticeMsg
  }
})(NoticeModal)
