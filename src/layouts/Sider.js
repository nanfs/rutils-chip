import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Icon, Layout, Button } from 'antd'
import { MyIcon } from '@/components'
import menuConfig from '*/menu'
import { checkAuth } from '@/utils/checkPermissions'
import { getItemFromLocal, setItemToLocal } from '@/utils/storage'

const { SubMenu } = Menu

export default class Sider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false
    }
    menuConfig.forEach(element => {
      if (element.children) {
        element.children.forEach(item => {
          if (this.props.path === item.path) {
            this.openKeys = [element.path, item.path]
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

  // 两级
  renderSubMenu(subMenu) {
    return (
      <SubMenu
        key={subMenu.path}
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
          this.openKeys = [...this.openKeys, e.key]
          this.forceUpdate()
        }}
        onMouseLeave={() => {
          const latestOpenKey = this.openKeys.slice(0, -1)
          this.openKeys = latestOpenKey
          this.forceUpdate()
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

  render() {
    const { openKeys } = this
    const collapsed = getItemFromLocal('isFolded') || false
    const defaultProps = collapsed ? {} : { openKeys } // 为了解决antd menu收缩时二级菜单不跟随的问题。
    return (
      <Layout.Sider
        width={200}
        className="sider"
        collapsible
        trigger={null}
        collapsed={!!collapsed}
      >
        <Button onClick={this.onCollapse} className="trigger" type="link">
          <Icon type="menu" style={{ fontSize: '20px' }}></Icon>
        </Button>
        <Menu
          defaultSelectedKeys={['1']}
          mode="inline"
          selectedKeys={[this.props.path]}
          {...defaultProps}
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
