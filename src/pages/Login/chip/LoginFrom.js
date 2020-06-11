import React from 'react'
import { Button, Input, Form, Icon, message } from 'antd'
import { Formx } from '@/components'
import { getUser } from './ftusbkey'
import { required } from '@/utils/valid'
import encrypt from '@/utils/encrypt'
import { setObjItemTolocal, setItemToLocal } from '@/utils/storage'
import {
  setClusterToSession,
  setDataCenterToSession,
  setHostToSession,
  setDomainToSession
} from '@/utils/preFilter'
import loginApi from '@/services/login'

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.fetchProperties()
    this.state = {
      loading: false
    }
  }

  /**
   * @description 获取项目配置文件
   * @author lishuai
   * @date 2020-05-09
   */
  fetchProperties() {
    loginApi
      .getProperties()
      .then(res => {
        setObjItemTolocal('properties', res)
        const { hasPin } = res
        this.setState({ hasPin })
      })
      .catch(e => {
        console.log(e)
        this.setState({ hasPin: false })
      })
  }

  checkUsbkey(username, pincode) {
    let user
    try {
      user = getUser(pincode)
    } catch (e) {
      message.error(e.message)
      return false
    }
    if (user !== username) {
      message.error('当前登录用户与UsbKey不匹配')
      return false
    }
    return true
  }

  login = values => {
    let data = {}
    this.setState({ loading: true })
    if (
      this.state.hasPin &&
      !this.checkUsbkey(values.username, values.pincode)
    ) {
      this.setState({ loading: false })
      return false
    }
    data = {
      username: values.username,
      // password: encrypt(values.password),
      password: values.password,
      domain: 'internal'
    }
    loginApi
      .login(data)
      .then(res => {
        this.setState({ loading: false })
        if (res.success) {
          // 如果是老接口 转换成新的接收数据格式 并关闭三权
          const ruleData =
            typeof res.data === 'object'
              ? res.data
              : {
                  userName: res.data,
                  userRole: res.data,
                  threePowersSwitch: false,
                  userId: 1
                }
          setItemToLocal(ruleData)
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
        submitting={false}
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
            autoFocus="autofocus"
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
          <Input.Password
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="密码"
            visibilityToggle
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
                message: '请输入PIN码'
              }
            ]}
          >
            <Input.Password
              prefix={<Icon type="usb" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="请输入PIN码"
              visibilityToggle
              style={{ height: 48 }}
            />
          </Form.Item>
        )}
        <Form.Item wrapperCol={{ sm: { span: 24 } }} style={{ marginTop: 60 }}>
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
