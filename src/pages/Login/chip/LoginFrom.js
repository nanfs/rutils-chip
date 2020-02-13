import React from 'react'
import { Button, Input, Form, Icon, message } from 'antd'
import Formx from '@/components/Formx'
import loginApi from '@/services/login'
import { ftInit, getUsbKeyId, getUser } from './ftusbkey'
import encrypt from './encrypt'

export default class LoginForm extends React.Component {
  state = {
    error: ''
  }

  constructor(props) {
    super(props)
    ftInit()
  }

  checkUsbkey(username, pincode) {
    let user
    try {
      user = getUser(pincode)
    } catch (e) {
      this.setState({ error: e.message })
      return false
    }
    if (user !== username) {
      this.setState({ error: '当前登录用户与UsbKey不匹配' })
      return false
    }
    this.setState({ error: '' })
    return true
  }

  login(values) {
    if (!this.checkUsbkey(values.username, values.pincode)) {
      return false
    }
    const data = {
      username: values.username,
      usbkeyid: getUsbKeyId(values.pincode),
      password: encrypt(values.password)
    }
    console.log(data)
    loginApi
      .login(data)
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
  }

  render() {
    return (
      <Formx
        onRef={ref => {
          this.formx = ref
        }}
        onSubmit={this.login.bind(this)}
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
          prop="pincode"
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
        {this.state.error && <span className="error">{this.state.error}</span>}
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
