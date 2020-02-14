import React from 'react'
import { Modal, Button, notification, message } from 'antd'
import { wrapResponse } from '@/utils/tool'

const ModalCfg_init = {
  forceRender: true,
  destroyOnClose: true,
  loading: false,
  okText: '确定',
  cancelText: '取消',
  hasFooter: true
}
export function createModalCfg(myCfg) {
  return Object.assign(ModalCfg_init, myCfg)
}
class Modalx extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      submitting: false
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.form = (this.formRef && this.formRef.props.form) || undefined
  }

  show = () => {
    this.setState({
      show: true
    })
  }

  onClose = () => {
    this.setState({
      show: false
    })
  }

  // TODO 修改处理方式
  afterSubmit = res => {
    return new Promise(resolve => {
      wrapResponse(res)
        .then(() => {
          this.setState({
            show: false,
            submitting: false
          })
          notification.success({ message: res.message || '操作成功' })
          resolve(res)
        })
        .catch(() => {
          message.error(res.message || '操作失败')
          this.setState({
            submitting: false
          })
        })
    })
  }

  submit = () => {
    const { onOk } = this.props
    const { form } = (this.formRef && this.formRef.props) || {}
    this.setState({
      submitting: true
    })
    if (form && onOk) {
      // 使用回调
      form
        .validateFieldsAndScroll((errors, values) => {
          if (!errors) {
            onOk(values)
          }
        })
        .catch(err => {
          console.log(err)
          this.setState({
            submitting: false
          })
        })
    } else {
      onOk && onOk()
    }
  }

  hasFormx() {
    if (
      React.isValidElement(this.props.children) &&
      this.props.children &&
      this.props.children.type.displayName === 'Form(Formx)'
    ) {
      return true
    }
    return false
  }

  renderContent(setFormRef) {
    // if (this.state.show) {
    return this.hasFormx()
      ? React.cloneElement(this.props.children, { onRef: setFormRef })
      : this.props.children
    // }
    // return undefined
  }

  render() {
    const { submitting } = this.state
    const { modalCfg, title } = this.props
    const setFormRef = ref => {
      this.formRef = ref
    }
    return (
      <Modal
        {...modalCfg}
        visible={this.state.show}
        onCancel={this.onClose}
        onOk={this.onOk}
        title={title || modalCfg.title}
        footer={
          modalCfg.hasFooter
            ? [
                <Button key="back" onClick={this.onClose}>
                  {modalCfg.cancelText}
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={submitting}
                  onClick={this.submit}
                >
                  {modalCfg.okText}
                </Button>
              ]
            : null
        }
      >
        {this.renderContent(setFormRef)}
      </Modal>
    )
  }
}
export default Modalx
