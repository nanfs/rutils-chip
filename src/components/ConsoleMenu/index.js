import React from 'react'
import classnames from 'classnames'
import { Menu } from 'antd'
import { NavLink } from 'react-router-dom'
import MyIcon from '@/components/MyIcon'

function ConsoleMenu(props) {
  const { className, menus } = props
  const menuItemRender = menuArr =>
    menuArr &&
    menuArr.map(menu => (
      <Menu.Item key={menu.name}>
        <NavLink to={menu.path}>
          <MyIcon type={menu.icon} component="svg" />
          {menu.title}
        </NavLink>
      </Menu.Item>
    ))
  const cls = classnames(className, 'menu-wrapper')
  return (
    <div className={cls}>
      <Menu mode="horizontal">{menuItemRender(menus)}</Menu>
    </div>
  )
}

export default ConsoleMenu
