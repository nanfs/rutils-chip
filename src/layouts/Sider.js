import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Icon, Layout, Button } from 'antd'
import MyIcon from '@/components/MyIcon'
import menuConfig from '*/menu'

const { SubMenu } = Menu

export default class Sider extends React.Component {
  onCollapse = () => {
    this.props.dispatch({ type: 'app/toggleSideFold' })
  }

  renderMenuItem(item) {
    return (
      <Menu.Item key={item.path}>
        <NavLink to={item.path}>
          {item.iconComonpent ? (
            <MyIcon type={item.icon} component="svg" />
          ) : (
            <Icon type={item.icon} />
          )}
          <span className="text">{item.title}</span>
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
            {subMenu.iconComonpent ? (
              <MyIcon type={subMenu.icon} />
            ) : (
              <Icon type={subMenu.icon} />
            )}
            <span className="text">{subMenu.title}</span>
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
        width={190}
        className="sider"
        collapsible
        trigger={null}
        collapsed={this.props.collapsed}
      >
        <Button onClick={this.onCollapse} className="trigger" type="link">
          <Icon type="menu" style={{ fontSize: '20px' }}></Icon>
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
