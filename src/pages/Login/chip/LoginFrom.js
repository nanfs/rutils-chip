import React from 'react'
import { Button, Input, Form, Icon, message } from 'antd'
import Formx from '@/components/Formx'
import loginApi from '@/services/login'

export default class LoginForm extends React.Component {
  render() {
    return (
      <Formx
        onRef={ref => {
          this.formx = ref
        }}
        onSubmit={values => {
          console.log(values)
          loginApi
            .login({ ...values })
            .then(res => {
              if (res.success) {
                message.success('登录成功')
              } else {
                message.error(res.message || '登录失败')
              }
            })
            .catch(errors => {
              console.log(errors)
            })
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
          rules={[
            {
              required: true,
              message: '请输入用户名'
            }
          ]}
          wrapperCol={{ sm: { span: 24 } }}
        >
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="用户名"
            style={{ height: 48 }}
          />
        </Form.Item>
        <Form.Item
          prop="password"
          wrapperCol={{ sm: { span: 24 } }}
          rules={[
            {
              required: true,
              message: '请输入密码'
            }
          ]}
        >
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="密码"
            style={{ height: 48 }}
          />
        </Form.Item>
        <Form.Item
          prop="usbkey"
          wrapperCol={{ sm: { span: 24 } }}
          rules={[
            {
              required: true,
              message: '请输入UsbKey'
            }
          ]}
        >
          <Input
            prefix={<Icon type="usb" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="UsbKey"
            style={{ height: 48 }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ sm: { span: 24 } }} style={{ marginTop: 40 }}>
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
