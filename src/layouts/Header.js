import React from 'react'
import { Layout, Menu, message } from 'antd'
import { USER, setUserToLocal, reloadAuthorized } from '@/utils/auth'
import ResetPwModal from './chip/ResetPwModal'
import SystemModal from './chip/SystemModal'
import AboutModal from './chip/AboutModal'
import loginApi from '@/services/login'

export default class Header extends React.Component {
  logOut = () => {
    setUserToLocal(null)
    reloadAuthorized()
    loginApi
      .loginOut()
      .then(res => {
        if (res.success) {
          return this.props.history.push('/login')
        } else {
          message.error(res.message || '操作失败')
        }
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  render() {
    return (
      <Layout.Header className="header">
        <div className="logo">
          <span className="text">安全虚拟桌面管理</span>
        </div>
        <Menu mode="horizontal">
          <Menu.Item key="username">
            <span>{USER.name}</span>
          </Menu.Item>
          <Menu.Item
            key="systemConfig"
            onClick={() => {
              this.sysModal.pop()
            }}
          >
            <span>系统设置</span>
          </Menu.Item>
          <Menu.Item
            key="about"
            onClick={() => {
              this.aboutModal.pop()
            }}
          >
            <span>关于</span>
          </Menu.Item>
          <Menu.Item
            key="changePwd"
            onClick={() => {
              this.modal.pop()
            }}
          >
            <span>修改密码</span>
          </Menu.Item>
          <Menu.Item key="logout" onClick={this.logOut}>
            <span>注销</span>
          </Menu.Item>
        </Menu>
        <ResetPwModal
          onRef={ref => {
            this.modal = ref
          }}
        />
        <SystemModal
          onRef={ref => {
            this.sysModal = ref
          }}
        />
        <AboutModal
          onRef={ref => {
            this.aboutModal = ref
          }}
        />
      </Layout.Header>
    )
  }
}
