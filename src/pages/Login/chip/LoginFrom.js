import React from 'react'
import { Button, Input, Form, Icon, message } from 'antd'
import { Formx } from '@/components'
import loginApi from '@/services/login'
import { ftInit, getUsbKeyId, getUser } from './ftusbkey'
import encrypt from './encrypt'
import { setUserToLocal, reloadAuthorized } from '@/utils/auth'
import { required } from '@/utils/valid'
import {
  setClusterToSession,
  setDataCenterToSession,
  setHostToSession,
  setDomainToSession
} from '@/utils/storage'

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    ftInit()
    this.state = {
      error: '',
      hasPin: false,
      loading: false
    }
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

  login = values => {
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
    this.setState({ loading: true })
    loginApi
      .login(data)
      .then(res => {
        this.setState({ loading: false })
        if (res.success) {
          setUserToLocal(data.username)
          reloadAuthorized()
          // 解决第一次加载的问题
          setClusterToSession()
          setDataCenterToSession()
          setHostToSession()
          setDomainToSession()
          window.location.hash = 'dashboard'
        } else {
          message.error(res.message || '登录失败')
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        message.error(error.message || error)
        console.log(error)
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
          required
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
          required
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
            required
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
            loading={this.state.loading}
          >
            登录
          </Button>
        </Form.Item>
      </Formx>
    )
  }
}
