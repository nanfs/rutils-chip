import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { List, Icon, Menu } from 'antd'
import { CURRENT } from '@/utils/auth'

const { SubMenu } = Menu
class SideMenuBase extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  renderMenuItem(item, level) {
    const { selectedKey } = this.props
    const iconShow = item.icon ? 'show' : 'hide'
    const isShow =
      (typeof item.authority !== 'undefined' &&
        item.authority.indexOf(CURRENT) !== -1) ||
      typeof item.authority === 'undefined'
    return (
      !!isShow && (
        <Menu
          component={NavLink}
          to={item.path}
          selected={selectedKey === item.path}
          key={item.path}
          depth={level}
          title={item.title}
        >
          <Icon className={iconShow} type={item.icon} />
          {item.title}
        </Menu>
      )
    )
  }

  renderSubMenu(item, level, user) {
    const { onOpenableItemClick, openKeys, activeKeys } = this.props
    const title = [item.title]
    return (
      <SubMenu
        active={activeKeys.indexOf(item.path) !== -1}
        open={openKeys.indexOf(item.path) !== 100}
        onOpenChange={onOpenableItemClick}
        title={title}
        key={item.path}
        _key={item.path}
        depth={level}
      >
        {item.children.map(_item => {
          if (_item.children) {
            return this.renderSubMenu(_item, level + 1, user)
          }
          return this.renderMenuItem(_item, level + 1, user)
        })}
      </SubMenu>
    )
  }

  render() {
    const { tree, user = '' } = this.props
    const level = 1
    return (
      <List className="d-sidemenu" component="div">
        {tree.map(item => {
          const isShow =
            (typeof item.authority !== 'undefined' &&
              item.authority.indexOf(CURRENT) !== -1) ||
            typeof item.authority === 'undefined'
          if (item.children && isShow) {
            return this.renderSubMenu(item, level, user)
          }
          return this.renderMenuItem(item, level, user)
        })}
      </List>
    )
  }
}

SideMenuBase.propTypes = {
  activeKeys: PropTypes.array,
  selectedKey: PropTypes.string,
  openKeys: PropTypes.array,
  onOpenableItemClick: PropTypes.func,
  tree: PropTypes.array
}

export default SideMenuBase
