import React from 'react'
import { Drawer, Col, Row, Button, notification, message } from 'antd'
import { wrapResponse } from '@/utils/tool'
import './index.less'

class Drawerx extends React.Component {
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
    document.body.style.maxHeight = '100vh'
    // document.body.style.overflow = 'hidden'
    document.querySelector('.table-wrap').style.minHeight =
      'calc(100vh - 105px)'
    document.querySelector('.table-wrap').style.overflow = 'hidden'
    document.querySelector('.ant-drawer-body .ant-form').style.Height =
      'calc(100vh - 185px)'
  }

  hide = () => {
    this.setState({
      show: false,
      submitting: false
    })
    document.body.style = ''
    document.querySelector('.table-wrap').style = ''
    document.querySelector('.ant-drawer-body .ant-form').style = ''
  }

  break = error => {
    if (error) {
      message.error(error.message || error)
    }
    this.setState({
      submitting: false
    })
  }

  onClose = () => {
    this.hide()
    const { form } = (this.formRef && this.formRef.props) || {}
    form.resetFields()
    const { onClose } = this.props
    onClose && onClose()
  }

  afterSubmit = res => {
    const { form } = (this.formRef && this.formRef.props) || {}
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
          form.resetFields()
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
          } else {
            this.break()
          }
        })
        .catch(error => {
          this.break()
          message.error(error.message || error)
        })
    } else {
      onOk && onOk()
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

  renderOption() {
    if (this.hasFormx()) {
      return (
        <Row className="option-wrap">
          <Col span={6} push={18}>
            <Button key="back" onClick={this.onClose}>
              取消
            </Button>
            <Button
              key="submit"
              type="primary"
              disabled={this.state.submitting}
              loading={this.state.submitting}
              onClick={this.submit}
            >
              确定
            </Button>
          </Col>
        </Row>
      )
    }
    return undefined
  }

  renderContent(setFormRef) {
    // if (this.state.show) {
    return this.hasFormx()
      ? React.cloneElement(this.props.children, {
          onRef: setFormRef,
          submitting: this.state.submitting
        })
      : this.props.children
    // }
    // return undefined
  }

  render() {
    const { title } = this.props
    const setFormRef = ref => {
      this.formRef = ref
    }
    return (
      <Drawer
        closable={false}
        getContainer={false}
        width={'100%'}
        placement="right"
        visible={this.state.show}
        onClose={this.onClose}
        title={title}
        style={{ position: 'absolute' }}
        className="drawerx"
      >
        {this.renderContent(setFormRef)}
        {this.renderOption()}
      </Drawer>
    )
  }
}
export default Drawerx
