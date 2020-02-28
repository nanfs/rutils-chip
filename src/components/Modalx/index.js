import React from 'react'
import { Modal, Button, notification, message } from 'antd'
import { wrapResponse } from '@/utils/tool'

const ModalCfg_init = {
  forceRender: true,
  // destroyOnClose: true,
  loading: false,
  okText: '确定',
  cancelText: '取消',
  hasFooter: true
}
export function createModalCfg(myCfg) {
  return { ...ModalCfg_init, ...myCfg }
}
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7, pull: 1 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
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

  componentDidUpdate() {
    this.form = (this.formRef && this.formRef.props.form) || undefined
  }

  show = () => {
    this.setState({
      show: true
    })
  }

  break = () => {
    this.setState({
      submitting: false
    })
  }

  afterClose = () => {
    this.form && this.form.resetFields()
  }

  onClose = () => {
    const { onClose } = this.props
    this.setState({
      show: false,
      submitting: false
    })
    onClose && onClose()
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
        .catch(errors => {
          message.error(errors)
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
      ? React.cloneElement(this.props.children, {
          onRef: setFormRef,
          formItemLayout
        })
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
        afterClose={this.afterClose}
        title={title || modalCfg.title}
        className={this.props.className}
        footer={
          modalCfg && modalCfg.hasFooter
            ? [
                <Button key="back" onClick={this.onClose}>
                  {modalCfg.cancelText}
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={submitting}
                  disabled={submitting}
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
