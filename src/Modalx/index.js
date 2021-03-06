import React from 'react'
import { Modal, Button, notification, message } from 'antd'
import { wrapResponse } from '../utils/tool'
import './index.less'
import classnames from 'classnames'

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

  break = error => {
    if (error) {
      message.error(error.message || error)
    }
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

  afterSubmit = res => {
    return new Promise(resolve => {
      wrapResponse(res)
        .then(() => {
          this.setState({
            show: false,
            submitting: false
          })
          this.props.onSuccess && this.props.onSuccess()
          notification.success({ message: res.message || '操作成功' })
          resolve(res)
        })
        .catch(error => {
          message.error(error.message || error)
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
          } else {
            this.setState({
              submitting: false
            })
          }
        })
        .catch(() => {
          this.setState({
            submitting: false
          })
        })
    } else {
      const status = onOk && onOk()
      if (status === 'noLoading') {
        this.setState({
          submitting: false
        })
      }
    }
  }

  hasFormx() {
    if (
      React.isValidElement(this.props.children) &&
      this.props.children &&
      this.props.children?.type?.displayName?.includes('Form')
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
          submitting: this.state.submitting,
          formItemLayout: this.props.formItemLayout || formItemLayout
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
    const cls = classnames('modalx', this.props.className)
    return (
      <Modal
        {...modalCfg}
        visible={this.state.show}
        onCancel={this.onClose}
        onOk={this.onOk}
        afterClose={this.afterClose}
        title={title || modalCfg.title}
        className={cls}
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
Modalx.createModalCfg = createModalCfg

export default Modalx
