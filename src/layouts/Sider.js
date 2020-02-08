import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Icon, Layout, Button } from 'antd'
import menuConfig from '*/menu'

const { SubMenu } = Menu

export default class Sider extends React.Component {
  state = {
    collapsed: false
  }

  onCollapse = collapsed => {
    console.log(collapsed)
    this.setState({ collapsed: !this.state.collapsed })
  }

  renderMenuItem(item) {
    return (
      <Menu.Item key={item.path}>
        <Icon type={item.icon} />
        <NavLink to={item.path}>
          <span>{item.title}</span>
        </NavLink>
      </Menu.Item>
    )
  }

  // 两级
  renderSubMenu(subMenu) {
    return (
      <SubMenu
        key={subMenu.title}
        title={
          <span>
            <Icon type={subMenu.icon} />
            <span>{subMenu.title}</span>
          </span>
        }
      >
        {subMenu.children.map(item => {
          if (item.children) {
            return this.renderSubMenu(item)
          }
          return this.renderMenuItem(item)
        })}
      </SubMenu>
    )
  }

  render() {
    return (
      <Layout.Sider
        className="sider"
        collapsible
        trigger={null}
        collapsed={this.state.collapsed}
      >
        <Button onClick={this.onCollapse} className="trigger" type="link">
          <Icon type="user"></Icon>
        </Button>
        <Menu
          defaultSelectedKeys={['1']}
          mode="inline"
          selectedKeys={[this.props.path]}
        >
          {menuConfig.map(item => {
            if (item.children) {
              return this.renderSubMenu(item)
            }
            return this.renderMenuItem(item)
          })}
        </Menu>
      </Layout.Sider>
    )
  }
}
