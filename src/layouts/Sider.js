import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Icon, Layout, Button } from 'antd'
import { MyIcon } from '@/components'
import menuConfig from '*/menu'
import { checkAuth } from '@/utils/checkPermissions'
import { getItemFromLocal, setItemToLocal } from '@/utils/storage'

export default class Sider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false
    }
    menuConfig.forEach(element => {
      if (this.props.path === element.path) {
        this.openKeys = [element.path]
        this.forceUpdate()
      }
      if (element.children) {
        console.log('element :>> ', element)
        element.children.forEach(item => {
          if (this.props.path === item.path) {
            this.openKeys = [element.path, item.path]
            console.log('element :>> ', this.openKeys)
            this.forceUpdate()
          }
        })
      }
    })
  }

  // componentDidMount() {
  //   menuConfig.forEach(element => {
  //     if (element.children) {
  //       element.children.forEach(item => {
  //         if (this.props.path === item.path) {
  //           this.openKeys = [element.path, item.path]
  //           this.forceUpdate()
  //         }
  //       })
  //     }
  //   })
  // }

  openKeys = []

  onCollapse = () => {
    const isFolded = getItemFromLocal('isFolded') || false
    setItemToLocal({ isFolded: !isFolded })
    this.forceUpdate()
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

  // 暂时两级
  renderSubMenu(subMenu) {
    const { openKeys } = this
    const defaultProps = { openKeys, selectedKeys: openKeys }
    if (!checkAuth(subMenu.authority)) {
      return
    }
    return (
      <Menu.Item key={subMenu.path}>
        <span>
          {subMenu.iconComonpent ? (
            <MyIcon type={subMenu.icon} />
          ) : (
            <Icon type={subMenu.icon} />
          )}
          <span className="text">{subMenu.title}</span>
        </span>
        <Menu className="submenu-1" {...defaultProps}>
          <h3>{subMenu.title}</h3>
          {subMenu.children.map(item => {
            if (item.children) {
              return this.renderSubMenu(item)
            }
            return this.renderMenuItem(item)
          })}
        </Menu>
      </Menu.Item>
    )
  }

  render() {
    const { openKeys } = this
    const collapsed = getItemFromLocal('isFolded')
    const defaultProps = { openKeys, selectedKeys: openKeys }
    // 为了解决antd menu收缩时二级菜单不跟随的问题。
    console.log('open :>> ', openKeys)
    return (
      <Layout.Sider
        width={200}
        collapsedWidth={46}
        className="sider"
        collapsible
        trigger={null}
        collapsed={!!collapsed}
      >
        <Button onClick={this.onCollapse} className="trigger" type="link">
          <Icon type="menu" style={{ fontSize: '16px' }}></Icon>
        </Button>
        <Menu mode="inline" {...defaultProps}>
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
