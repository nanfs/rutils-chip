import React from 'react'
import PropTypes from 'prop-types'

function getFlatTreeKeys(tree) {
  let keys = []
  tree.forEach(item => {
    keys.push(item.path)
    if (item.children) {
      keys = keys.concat(getFlatTreeKeys(item.children))
    }
  })
  return keys
}

const treeOpen = Wrapped => {
  class TreeOpen extends React.Component {
    constructor(props) {
      super(props)
      this.isControlled = this.props.openKeys !== undefined
      this.flatTreeKeys = getFlatTreeKeys(this.props.tree)
      this.state = {
        openKeys: this.props.defaultOpenKeys || []
      }
    }

    handleOpenableItemClick = key => {
      const { closeSbibling, closeDescendant } = this.props
      let shouldCloseKeys = []
      let openKeys = this.getControlledValue('openKeys')
      const index = openKeys.indexOf(key)
      if (index === -1) {
        openKeys = [key, ...openKeys]

        if (closeSbibling) {
          const sbiblingKeys = this.getSbiblingKeys(key)
          shouldCloseKeys = shouldCloseKeys.concat(sbiblingKeys)

          if (closeDescendant) {
            sbiblingKeys.forEach(sbiblingKey => {
              shouldCloseKeys = shouldCloseKeys.concat(
                this.getDescendantKeys(sbiblingKey)
              )
            })
          }
        }
      } else {
        openKeys = [...openKeys.slice(0, index), ...openKeys.slice(index + 1)]
        if (closeDescendant) {
          shouldCloseKeys = shouldCloseKeys.concat(this.getDescendantKeys(key))
        }
      }

      if (shouldCloseKeys.length !== 0) {
        openKeys = openKeys.filter(openKey => {
          return shouldCloseKeys.indexOf(openKey) === -1
        })
      }
      this.requestOpenChange(openKeys)
    }

    getControlledValue(prop) {
      return this.isControlled ? this.props[prop] : this.state[prop]
    }

    getSbiblingKeys = key => {
      const parentPath = key
        .split('/')
        .slice(0, -1)
        .join('/')
      return this.flatTreeKeys.filter(path => {
        return (
          key !== path && path.replace(`${parentPath}/`, '').indexOf('/') === -1
        )
      })
    }

    getDescendantKeys = key => {
      return this.flatTreeKeys.filter(path => {
        const replaced = path.replace(`${key}/`, '')
        return replaced.length > 0 && replaced.length < path.length
      })
    }

    requestOpenChange(openKeys) {
      if (!this.isControlled) {
        this.setState({ openKeys })
      }

      if (this.props.onOpenChange) {
        this.props.onOpenChange(openKeys)
      }
    }

    isOpen = key => {
      const openKeys = this.getControlledValue('openKeys')
      return openKeys.indexOf(key) !== -1
    }

    render() {
      const {
        tree,
        closeSbibling,
        closeDescendant,
        openKeys: openKeysProp,
        defaultOpenKeys,
        onOpenChange,
        ...other
      } = this.props
      const openKeys = this.getControlledValue('openKeys')
      return (
        <Wrapped
          tree={tree}
          openKeys={openKeys}
          onOpenableItemClick={this.handleOpenableItemClick}
          isOpen={this.isOpen}
          {...other}
        />
      )
    }
  }

  TreeOpen.propTypes = {
    tree: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        children: PropTypes.array
      })
    ),
    /**
     * 当打开菜单时，是否关闭同级菜单
     */
    closeSbibling: PropTypes.bool,
    /**
     * 当关闭菜单时，是否关闭子孙菜单
     */
    closeDescendant: PropTypes.bool,
    openKeys: PropTypes.array,
    defaultOpenKeys: PropTypes.array,
    onOpenChange: PropTypes.func
  }
  TreeOpen.defaultProps = {
    closeSbibling: false,
    closeDescendant: true,
    defaultOpenKeys: []
  }

  return TreeOpen
}

export default treeOpen
