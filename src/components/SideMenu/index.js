import React from 'react'
import { compose } from 'redux'
import treeOpen from './treeOpen'
import SideMenuBase from './SideMenuBase'
import './index.scss'
/**
 * /list/search/articles = > ['list','/list/search']
 */
function urlToList(url) {
  const list = url.split('/').filter(i => i)
  return list.reduce((urlList, name) => {
    return urlList.concat(`${urlList[urlList.length - 1] || ''}/${name}`)
  }, [])
}

const SubMenuWithTreeOpen = compose(treeOpen)(SideMenuBase)

// eslint-disable-next-line react/no-multi-comp
class SubMenu extends React.Component {
  constructor(props) {
    super(props)
    const activeKeys = this.getDefaultCollapsedSubMenus(props)
    const selectedKey = activeKeys.pop()
    this.state = {
      activeKeys,
      openKeys: activeKeys,
      selectedKey
    }
  }
  // TODO
  // componentWillReceiveProps(nextProp) {
  //   if (nextProp.location.pathname !== this.props.location.pathname) {
  //     const activeKeys = this.getDefaultCollapsedSubMenus(nextProp)
  //     const selectedKey = activeKeys.pop()
  //     this.state = {
  //       activeKeys,
  //       openKeys: activeKeys,
  //       selectedKey
  //     }
  //   }
  // }

  handleOpenChange = openKeys => {
    this.setState({
      openKeys
    })
  }

  getDefaultCollapsedSubMenus(props) {
    const {
      location: { pathname }
    } = props || this.props
    const urlList = urlToList(pathname)
    return urlList
  }

  render() {
    const { openKeys, activeKeys, selectedKey } = this.state
    const { tree } = this.props
    return (
      <SubMenuWithTreeOpen
        tree={tree}
        closeSbibling
        openKeys={openKeys}
        activeKeys={activeKeys}
        selectedKey={selectedKey}
        onOpenChange={this.handleOpenChange}
      />
    )
  }
}

export default SubMenu
