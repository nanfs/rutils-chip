import React from 'react'
import { Button, Input, Form, Icon } from 'antd'
import { required } from '@/utils/valid'
import Formx from '@/components/Formx'

export default class LoginForm extends React.Component {
  render() {
    return (
      <Formx
        onRef={ref => {
          this.formx = ref
        }}
        onSubmit={values => {
          console.log(values)
          return false
        }}
        initValues={{
          username: 'test'
        }}
        {...this.props}
      >
        <Form.Item prop="username" rules={[required]}>
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item prop="reusername">
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            提交
          </Button>
        </Form.Item>
      </Formx>
    )
  }
}
