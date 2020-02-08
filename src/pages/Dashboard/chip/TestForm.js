import React from 'react'
import { Form, Icon, Input, Button, Select } from 'antd'
import Formx from '@/components/Formx'
import { minLength } from '@/utils/valid'

export default class TestForm extends React.Component {
  matchingPassword = (rule, value, callback) => {
    const username = this.formx.props.form.getFieldValue('username')
    if (username) {
      if (username !== value) {
        callback(new Error('二次输入密码不匹配'))
      }
    }
    callback()
  }

  render() {
    const { initValues } = this.props

    const children = []
    for (let i = 10; i < 36; i++) {
      children.push(
        <Select.Option key={i.toString(36) + i}>
          {i.toString(36) + i}
        </Select.Option>
      )
    }
    return (
      <Formx
        onSubmit={values => {
          console.log(values)
          return false
        }}
        onRef={ref => {
          this.form = ref
        }}
        initValues={initValues}
      >
        <Form.Item prop="username" rules={[minLength(2)]}>
          <Input
            onChange={() => {
              console.log('get')
            }}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="username"
          />
        </Form.Item>
        <Form.Item prop="zome">
          <Select
            onChange={() => {
              console.log(this)
              this.form.props.form.setFieldsValue({ username: 'ls' })
            }}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="username"
          >
            {children}
          </Select>
        </Form.Item>
        <Form.Item prop="test">
          <Input
            onChange={() => {
              console.log('get')
            }}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="username"
          />
        </Form.Item>
        <Form.Item
          prop="reusername"
          label="reusername"
          rules={[this.matchingPassword]}
        >
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in11
          </Button>
        </Form.Item>
      </Formx>
    )
  }
}
