import React from 'react'
import { Tree, Input, Spin, Menu, Modal, notification, message } from 'antd'
import { nodes2Tree, wrapResponse } from '@/utils/tool'

import AddNodeModal from './chip/AddNodeModal'
import EditNodeModal from './chip/EditNodeModal'
import MyIcon from '../MyIcon'

import './index.less'

const { confirm } = Modal
const { TreeNode } = Tree
const { Search } = Input

// 获取节点的父节点key
const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
// 获取每个节点 用于查找
const generateList = data => {
  const allKey = []
  const nodeList = []
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const { key, title } = node
    allKey.push(key.toString())
    nodeList.push({ key, title })
    if (node.children) {
      generateList(node.children)
    }
  }
  return { allKey, nodeList }
}
export default class Treex extends React.Component {
  state = {
    value: '',
    searchValue: '',
    autoExpandParent: true,
    expandedKeys: [],
    selectedKeys: [],
    nodeList: [],
    nodes: undefined,
    loadding: true,
    rightClickNodeTreeItem: {
      pageX: '',
      pageY: '',
      id: '',
      categoryName: ''
    },
    rightMenuStyle: { display: 'none' },
    nodeDeleteDisable: false
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    // document.addEventListener('contextmenu', this._handleContextMenu)
    document.addEventListener('click', this._handleClick)

    this.getTreeData()
  }

  componentWillUnmount() {
    // document.removeEventListener('contextmenu', this._handleContextMenu)
    document.removeEventListener('click', this._handleClick)
  }

  componentDidUpdate(prep) {
    if (this.props.treeData !== prep.value && prep.treeData === undefined) {
      this.setState({ nodes: this.props.treeData })
    }
  }

  getTreeData = () => {
    const {
      apiMethod,
      treeRenderSuccess,
      defaultSelectRootNode = true,
      treeData
    } = this.props

    if (!apiMethod) {
      this.setState({
        nodes: treeData,
        loading: false
      })
      return false
    }
    apiMethod()
      .then(res => {
        if (res.success) {
          const nodes = res.data.map(element => {
            return {
              ...element,
              key: element.key.toString(),
              id: element.id.toString(),
              value: element.id.toString(),
              parentId:
                element.parentId === null ? '-1' : element.parentId.toString()
            }
          })
          nodes.sort((a, b) => {
            return a.parentId - b.parentId
          })

          if (!Array.isArray(nodes) || !Object.keys(nodes[0]).includes('key')) {
            throw new Error('数据格式不符合')
          }
          const { allKey, nodeList } = generateList(nodes)
          this.setState({
            expandedKeys: allKey,
            selectedKeys: defaultSelectRootNode && [nodes[0].key], // 是否默认选中根节点
            nodeList,
            nodes,
            loading: false
          })
          defaultSelectRootNode &&
            treeRenderSuccess &&
            treeRenderSuccess(nodes[0].key, nodes)
        } else {
          this.nodes = []
          this.setState({ loading: false })
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        message.error(error.message || error)
        console.log(error)
      })
  }

  /* _handleContextMenu = e => {
    e.preventDefault()
    // e.stopPropagation()
    this.setState({
      rightMenuStyle: { display: 'none' }
    })
  } */

  _handleClick = () => {
    this.setState({
      rightMenuStyle: { display: 'none' }
    })
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  }

  // 树节点筛选
  onChange = e => {
    const { value } = e.target
    const { nodes, nodeList } = this.state
    const data = nodes2Tree(nodes)
    const expandedKeys = nodeList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, data)
        }
        return null
      })
      .filter((item, i, self) => item && self.indexbuOf(item) === i)
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true
    })
  }

  // 树节点选中
  onSelect = (key, node) => {
    const { onSelect } = this.props
    onSelect && onSelect(node.node.props.eventKey, node)
    this.setState({
      selectedKeys: [node.node.props.eventKey]
    })
  }

  renderTreeNode = (data, searchValue = '') =>
    data.map(item => {
      const index = item.title.indexOf(searchValue)
      let iconType = ''
      if (item.title === '本地组(internal)') {
        iconType = 'yonghuguanli'
      } else if (item.parentId === '-2') {
        iconType = 'adyu'
      }
      const beforeStr = item.title.substr(0, index)
      const afterStr = item.title.substr(index + searchValue.length)
      const title =
        index > -1 ? (
          <span title={item.title}>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span title={item.title}>{item.title}</span>
        )
      if (item.children) {
        return (
          <TreeNode
            key={item.id}
            title={title}
            data-key={item.id}
            data-title={item.title}
            parentId={item.parentId}
            type={item.type}
            icon={() =>
              iconType ? (
                <MyIcon
                  type={iconType}
                  component="svg"
                  style={{
                    fontSize: iconType === 'adyu' ? '22px' : '20px',
                    color: '#1890ff'
                  }}
                />
              ) : (
                ''
              )
            }
          >
            {this.renderTreeNode(item.children, searchValue)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.id}
          title={title}
          data-key={item.id}
          data-title={item.title}
          parentId={item.parentId}
          type={item.type}
          icon={() =>
            iconType ? (
              <MyIcon
                type={iconType}
                component="svg"
                style={{
                  fontSize: iconType === 'adyu' ? '22px' : '20px',
                  color: '#1890ff'
                }}
              />
            ) : (
              ''
            )
          }
        />
      )
    })

  // 点击鼠标右键
  onRightClick = e => {
    const nodeDeleteDisable = e.node.props.parentId === '-1'
    e.event.stopPropagation()
    this.setState({
      rightClickNodeTreeItem: {
        pageX: e.event.pageX,
        pageY: e.event.pageY,
        id: e.node.props['data-key'],
        name: e.node.props['data-title'],
        parentId: e.node.props.parentId
      },
      rightMenuStyle: {
        position: 'absolute',
        left: `${e.event.pageX - 230}px`,
        top: `${e.event.pageY - 115}px`,
        display: 'block',
        zIndex: 1001
      },
      nodeDeleteDisable
    })
  }

  // 删除树节点
  deleteNode = () => {
    const { deleteNodeApiMethod } = this.props
    const self = this
    confirm({
      title: '确认删除该节点吗？',
      onOk() {
        deleteNodeApiMethod({
          id: parseInt(self.state.rightClickNodeTreeItem.id, 10)
        }).then(res => {
          wrapResponse(res)
            .then(() => {
              notification.success({ message: '删除成功' })
              self.getTreeData()
            })
            .catch(error => {
              message.error(error.message || '删除失败')
            })
        })
      },
      onCancel() {}
    })
  }

  cleanSelected = () => {
    this.setState({
      selectedKeys: []
    })
  }

  render() {
    const {
      showSearch = true,
      showRightClinkMenu = false,
      addNodeApiMethod,
      editNodeApiMethod,
      checkable = false
    } = this.props
    const { rightClickNodeTreeItem, rightMenuStyle } = this.state
    // console.log(rightClickNodeTreeItem)
    // const { pageX, pageY, id, categoryName } = rightClickNodeTreeItem

    const {
      searchValue,
      expandedKeys,
      selectedKeys,
      autoExpandParent,
      nodes,
      loading
    } = this.state
    return (
      <Spin spinning={loading}>
        {showSearch && (
          <Search onChange={this.onChange} className="tree-search"></Search>
        )}
        <Tree
          showIcon
          defaultExpandAll
          selectedKeys={selectedKeys}
          className="tree-wrap"
          onExpand={this.onExpand}
          onSelect={this.onSelect}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          checkable={checkable}
          multiple
          onRightClick={showRightClinkMenu && this.onRightClick}
        >
          {this.renderTreeNode(nodes2Tree(nodes), searchValue)}
        </Tree>
        {rightClickNodeTreeItem && (
          <div style={{ ...rightMenuStyle }} className="self-right-menu">
            <Menu>
              <Menu.Item
                key="addNode"
                onClick={() => {
                  this.addNodeModal.pop()
                }}
              >
                新增下级部门
              </Menu.Item>
              <Menu.Item
                key="editNode"
                onClick={() => {
                  this.editNodeModal.pop()
                }}
                disabled={this.state.nodeDeleteDisable}
              >
                修改
              </Menu.Item>
              <Menu.Item
                key="deleteNode"
                onClick={this.deleteNode}
                disabled={this.state.nodeDeleteDisable}
              >
                删除
              </Menu.Item>
            </Menu>
          </div>
        )}
        <AddNodeModal
          onRef={ref => {
            this.addNodeModal = ref
          }}
          addNodeApiMethod={addNodeApiMethod}
          nodeValues={rightClickNodeTreeItem}
          addNodeSuccess={this.getTreeData}
        />
        <EditNodeModal
          onRef={ref => {
            this.editNodeModal = ref
          }}
          editNodeApiMethod={editNodeApiMethod}
          nodeValues={rightClickNodeTreeItem}
          editNodeSuccess={this.getTreeData}
        />
      </Spin>
    )
  }
}
