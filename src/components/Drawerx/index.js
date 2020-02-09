import React from 'react'
import { Drawer, Col, Row, Button, notification, message } from 'antd'
import { wrapResponse } from '@/utils/tool'

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
  }

  show = () => {
    this.setState({
      show: true
    })
  }

  hide = () => {
    this.setState({
      show: false
    })
  }

  onClose = () => {
    this.setState({
      show: false
    })
    const { onClose } = this.props
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
      onOk(form.getFieldsValue())
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

  renderOption() {
    if (this.hasFormx()) {
      return (
        <Row className="option-wrap">
          <Col span={4} push={20}>
            <Button key="back" onClick={this.onClose}>
              取消
            </Button>
            <Button
              key="submit"
              type="primary"
              loading={this.submitting}
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

  render() {
    const { submitting } = this.state
    const { title } = this.props
    const setFormRef = ref => {
      this.formRef = ref
    }
    return (
      <Drawer
        closable={false}
        getContainer={false}
        mask={false}
        width={'100%'}
        placement="right"
        visible={this.state.show}
        onClose={this.onClose}
        title={title}
        style={{ position: 'absolute' }}
        className="drawerx"
      >
        {this.hasFormx()
          ? React.cloneElement(this.props.children, { onRef: setFormRef })
          : this.props.children}
        {this.renderOption()}
      </Drawer>
    )
  }
}
export default Drawerx
