import React from 'react'
import { Button, Input, Form, Icon, message } from 'antd'
import Formx from '@/components/Formx'
import loginApi from '@/services/login'
import { ftInit, getUsbKeyId, getUser } from './ftusbkey'
import encrypt from './encrypt'
import { setUserToLocal } from '@/components/Authorized'
import { required } from '@/utils/valid'

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    ftInit()
    this.state = {
      error: '',
      hasPin: false
    }
  }

  // TODO 获取文件
  // componentDidMount() {
  //   loginApi
  //     .getProperties()
  //     .then(res => {
  //       // {hasPin:false}
  //       this.setState({ hasPin: res.hasPin })
  //       console.log(res)
  //     })
  //     .catch(e => console.log(e))
  // }

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

  login = values => {
    console.log('login', values)
    let data = {}
    if (this.state.hasPin) {
      if (!this.checkUsbkey(values.username, values.pincode)) {
        return false
      }
      data = {
        username: values.username,
        usbkeyid: getUsbKeyId(values.pincode),
        password: encrypt(values.password)
      }
    } else {
      data = {
        username: values.username,
        password: values.password,
        domain: 'internal'
        // password: encrypt(values.password)
      }
    }
    loginApi
      .login(data)
      .then(res => {
        if (res.success) {
          setUserToLocal(data.username)
          window.location.hash = 'dashboard'
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
        onSubmit={this.login}
        className={'login-form'}
      >
        <Form.Item
          prop="username"
          rules={[required]}
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
        {this.state.hasPin && (
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
        )}
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
