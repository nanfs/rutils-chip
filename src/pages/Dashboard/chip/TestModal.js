import React from 'react'

import { Form, Button, Icon, Modal } from 'antd'
import { Field, ReduxForm, InputField } from '@/components/ReduxForm'
import taskApi from '@/services/task'

class TestModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  pop = () => {
    this.setState({
      show: true
    })
    console.log('pop')
  }

  onClose = () => {
    this.setState({
      show: false
    })
  }

  render() {
    const {
      submintLoading,
      meta: { values }
    } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }

    const onSubmit = value => {
      taskApi.list(value).then(res => {
        // 假装获取到成功了   调整为弹窗实现 用内部变量控制
        console.log(res)
      })
      console.log('values', value)
      return values
    }
    return (
      <Modal visible={this.state.show} onCancel={this.onClose}>
        <Form {...formItemLayout} onSubmit={onSubmit}>
          <Form.Item label="任务名称">
            <Field name="content" component={InputField} />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 20, offset: 4 }
            }}
          >
            <Button
              type="primary"
              disabled={submintLoading}
              onClick={() => onSubmit(values)}
            >
              {submintLoading && <Icon type="loading" />}
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default ReduxForm({
  form: 'TestModal'
})(TestModal)
