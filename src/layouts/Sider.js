import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Icon, Layout, Button } from 'antd'
import { MyIcon } from '@/components'
import menuConfig from '*/menu'

const { SubMenu } = Menu

export default class Sider extends React.Component {
  componentDidMount() {
    menuConfig.forEach(element => {
      if (element.children) {
        this.rootSubmenuKeys.push(element.title)
        element.children.forEach(item => {
          if (this.props.path === item.path) {
            this.setState({
              openKeys: [element.title]
            })
          }
        })
      }
    })
  }

  rootSubmenuKeys = []

  state = {
    openKeys: []
  }

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

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    )
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      })
    }
  }

  render() {
    const { openKeys } = this.state
    const defaultProps = this.props.collapsed ? {} : { openKeys } // 为了解决antd menu收缩时二级菜单不跟随的问题。
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
          {...defaultProps}
          onOpenChange={this.onOpenChange}
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
