import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Icon, Layout, Button } from 'antd'
import { MyIcon } from '@/components'
import menuConfig from '*/menu'
import { checkAuth } from '@/utils/checkPermissions'

const { SubMenu } = Menu

export default class Sider extends React.Component {
  componentDidMount() {
    debugger
    menuConfig.forEach(element => {
      if (element.children) {
        this.rootSubmenuKeys.push(element.title)
        element.children.forEach(item => {
          if (this.props.path === item.path) {
            this.openKeys = [element.title, item.title]
            this.forceUpdate()
          }
        })
      }
    })
  }

  rootSubmenuKeys = []

  openKeys = []

  onCollapse = () => {
    this.props.dispatch({ type: 'app/toggleSideFold' })
  }

  renderMenuItem(item) {
    if (!checkAuth(item.authority)) {
      return
    }
    return (
      <Menu.Item key={item.path}>
        <NavLink to={item.path}>
          {item.iconComonpent ? (
            <MyIcon type={item.icon} />
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
        onMouseEnter={e => {
          console.log('0', this.openKeys)
          // if (this.state.openKeys.indexOf(e.key) === -1) {
          this.openKeys = [...this.openKeys, e.key]
          this.forceUpdate()

          console.log('1', this.openKeys)
          // }
        }}
        onMouseLeave={e => {
          console.log('2', this.openKeys)
          const latestOpenKey = this.openKeys.slice(0, -1)
          console.log('latestOpenKey', latestOpenKey)
          this.openKeys = latestOpenKey
          this.forceUpdate()

          console.log('3', this.openKeys)
        }}
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
    console.log(openKeys)
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
    const { openKeys } = this
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
          // onOpenChange={this.onOpenChange}
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
