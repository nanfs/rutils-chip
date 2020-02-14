import React from 'react'
import { push } from 'react-router-redux'
import { Icon, Layout, Menu } from 'antd'
import { USER } from '@/utils/auth'
import { setUserToLocal } from '../components/Authorized'
import ResetPwModal from './chip/ResetPwModal'
import SystemModal from './chip/SystemModal'
import AboutModal from './chip/AboutModal'

export default class Header extends React.Component {
  render() {
    return (
      <Layout.Header className="header">
        <div className="logo">
          <span className="text">安全虚拟桌面管理</span>
        </div>
        <Menu mode="horizontal">
          <Menu.Item key="username">
            <span>
              <Icon type="user" /> <span>{USER.name}</span>
            </span>
          </Menu.Item>
          <Menu.Item
            key="systemConfig"
            onClick={() => {
              this.sysModal.pop()
              console.log('systemConfig')
            }}
          >
            <Icon type="user" />
            <span>系统设置</span>
          </Menu.Item>
          <Menu.Item
            key="about"
            onClick={() => {
              this.aboutModal.pop()
              console.log('about')
            }}
          >
            <Icon type="user" />
            <span>关于</span>
          </Menu.Item>
          <Menu.Item
            key="changePwd"
            onClick={() => {
              this.modal.pop()
              console.log('changePwd')
            }}
          >
            <Icon type="user" />
            <span>修改密码</span>
          </Menu.Item>
          <Menu.Item
            key="logout"
            onClick={() => {
              console.log('用户已注销')
              setUserToLocal({})
              return push('/login')
            }}
          >
            <Icon type="logout" />
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
