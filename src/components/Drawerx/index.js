import React from 'react'
import {
  Drawer,
  Col,
  Row,
  Button,
  notification,
  message,
  Spin,
  Icon
} from 'antd'
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
    document.querySelector('.table-wrap').style.height = 'calc(100vh - 105px)'
    document.querySelector('.table-wrap').style.overflow = 'hidden'
    if (document.querySelector('.ant-drawer-body .ant-form')) {
      document.querySelector('.ant-drawer-body .ant-form').style.Height =
        'calc(100vh - 185px)'
    }
  }

  // 隐藏没有重置表单 点取消去重置表单  this is a feature cancel
  hide = () => {
    const { form } = (this.formRef && this.formRef.props) || {}
    form && form.resetFields && form.resetFields()
    this.setState({
      show: false,
      submitting: false
    })
    document.body.style = ''
    document.querySelector('.table-wrap').style = ''
    if (document.querySelector('.ant-drawer-body .ant-form')) {
      document.querySelector('.ant-drawer-body .ant-form').style = ''
    }
  }

  showAndWait = () => {
    this.setState({
      loading: true
    })
    this.show()
  }

  finished = () => {
    this.setState({
      loading: false
    })
  }

  onClose = () => {
    this.hide()
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
          console.log(res.message, res)
          message.error(res.message || '操作失败')
          this.setState({
            submitting: false
          })
        })
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

  renderContent(setFormRef, show) {
    // if (this.state.show) {
    return this.hasFormx()
      ? React.cloneElement(this.props.children, {
          onRef: setFormRef,
          submitting: this.state.submitting,
          isParentShow: show
        })
      : React.cloneElement(this.props.children, {
          isParentShow: show
        })
    // }
    // return undefined
  }

  render() {
    const { title } = this.props
    const setFormRef = ref => {
      this.formRef = ref
    }
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

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
        <Spin
          indicator={antIcon}
          wrapperClassName="no-position"
          spinning={this.state.submitting || !!this.state.loading}
          tip="正在处理!请稍后"
        >
          {this.renderContent(setFormRef, this.state.show)}
          {this.renderOption()}
        </Spin>
      </Drawer>
    )
  }
}
export default Drawerx
