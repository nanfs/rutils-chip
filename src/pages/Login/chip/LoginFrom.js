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
        initValues={
          {
            // username: 'test'
          }
        }
        {...this.props}
      >
        <Form.Item
          prop="username"
          rules={[required]}
          wrapperCol={{ sm: { span: 24 } }}
        >
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="用户名"
          />
        </Form.Item>
        <Form.Item prop="password" wrapperCol={{ sm: { span: 24 } }}>
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item prop="usbkey" wrapperCol={{ sm: { span: 24 } }}>
          <Input
            prefix={<Icon type="usb" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="UsbKey"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ sm: { span: 24 } }}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
        </Form.Item>
      </Formx>
    )
  }
}
