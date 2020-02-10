import React from 'react'
import { Icon, Layout, Menu } from 'antd'
import { USER } from '@/utils/auth'

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
              console.log('systemConfig')
            }}
          >
            <Icon type="user" />
            <span>系统设置</span>
          </Menu.Item>
          <Menu.Item
            key="about"
            onClick={() => {
              console.log('about')
            }}
          >
            <Icon type="user" />
            <span>关于</span>
          </Menu.Item>
          <Menu.Item
            key="changePwd"
            onClick={() => {
              console.log('changePwd')
            }}
          >
            <Icon type="user" />
            <span>修改密码</span>
          </Menu.Item>
          <Menu.Item
            key="logout"
            onClick={() => {
              console.log('系统设置')
            }}
          >
            <Icon type="logout" />
            <span>注销</span>
          </Menu.Item>
        </Menu>
      </Layout.Header>
    )
  }
}
