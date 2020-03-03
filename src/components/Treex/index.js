import React from 'react'
import { Tree, Input, Spin, Menu, Modal, notification, message } from 'antd'
import { nodes2Tree } from '@/utils/tool'

import AddNodeModal from './chip/AddNodeModal'
import EditNodeModal from './chip/EditNodeModal'

import './index.scss'

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
    // document.addEventListener('contextmenu', this._handleContextMenu)
    document.addEventListener('click', this._handleClick)

    this.getTreeData()
  }

  componentWillUnmount() {
    // document.removeEventListener('contextmenu', this._handleContextMenu)
    document.removeEventListener('click', this._handleClick)
  }

  getTreeData = () => {
    const { apiMethod, treeRenderSuccess } = this.props
    if (!apiMethod) {
      throw new Error('没有树请求方法')
    }
    /* const nodes = [
      {
        id: '0',
        key: '0',
        title: '用户组',
        parentId: null
      },
      {
        id: '1',
        key: '1',
        title: '成都研发中心',
        parentId: '0'
      },
      {
        id: '2',
        key: '2',
        title: '设计组',
        parentId: '5'
      },
      {
        id: '3',
        key: '3',
        title: '前端组',
        parentId: '1'
      },
      {
        id: '4',
        key: '4',
        title: '北京研发中心',
        parentId: '1'
      },
      {
        id: '5',
        key: '5',
        title: '前端组',
        parentId: '4'
      }
    ]
    if (!Array.isArray(nodes) || !Object.keys(nodes[0]).includes('key')) {
      throw new Error('数据格式不符合')
    }
    const { allKey, nodeList } = generateList(nodes)
    this.setState({
      expandedKeys: allKey,
      selectedKeys: [nodes[0].key],
      nodeList,
      nodes,
      loading: false
    })
    treeRenderSuccess && treeRenderSuccess(nodes[0].key) */
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
            selectedKeys: [nodes[0].key],
            nodeList,
            nodes,
            loading: false
          })
          treeRenderSuccess && treeRenderSuccess(nodes[0].key, nodes)
        } else {
          this.nodes = []
          this.setState({ loading: false })
        }
      })
      .catch(errors => {
        this.setState({ loading: false })
        message.error(errors)
        console.log(errors)
      })
  }

  /* _handleContextMenu = e => {
    e.preventDefault()
    // e.stopPropagation()
    this.setState({
      rightMenuStyle: { display: 'none' }
    })
  } */

  _handleClick = e => {
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
      .filter((item, i, self) => item && self.indexOf(item) === i)
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true
    })
  }

  // 树节点选中
  onSelect = (key, node) => {
    console.log(node)
    const { onSelect } = this.props
    onSelect && onSelect(node.node.props.eventKey, node)
    this.setState({
      selectedKeys: [node.node.props.eventKey]
    })
  }

  renderTreeNode = (data, searchValue = '') =>
    data.map(item => {
      const index = item.title.indexOf(searchValue)
      const beforeStr = item.title.substr(0, index)
      const afterStr = item.title.substr(index + searchValue.length)
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        )
      if (item.children) {
        return (
          <TreeNode
            key={item.id}
            title={title}
            data-key={item.id}
            data-title={item.title}
            parentId={item.parentId}
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
        />
      )
    })

  /* getNodeTreeRightClickMenu = () => {
    const { pageX, pageY, id, categoryName } = {
      ...this.state.rightClickNodeTreeItem
    }
    const tmpStyle = {
      position: 'absolute',
      left: `${pageX - 230}px`,
      top: `${pageY - 115}px`,
      display: 'block'
    }
    const menu = (
      <div
        style={{ display: this.state.rightMenuShow, ...tmpStyle }}
        className="self-right-menu"
      >
        <Menu>
          <Menu.Item>新增下级部门</Menu.Item>
          <Menu.Item>修改</Menu.Item>
          <Menu.Item>删除</Menu.Item>
        </Menu>
      </div>
    )
    return this.state.rightClickNodeTreeItem == null ? '' : menu
  } */

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

  deleteNode = () => {
    const { deleteNodeApiMethod } = this.props
    const self = this
    confirm({
      title: '确认删除该节点吗？',
      onOk() {
        deleteNodeApiMethod({
          id: parseInt(self.state.rightClickNodeTreeItem.id, 10)
        })
          .then(res => {
            if (res.success) {
              notification.success({ message: '删除成功' })
              self.getTreeData()
            } else {
              message.error(res.message || '删除失败')
            }
          })
          .catch(errors => {
            message.error(errors)
            console.log(errors)
          })
      },
      onCancel() {}
    })
  }

  render() {
    const {
      showSearch = true,
      addNodeApiMethod,
      editNodeApiMethod
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
          defaultExpandAll
          selectedKeys={selectedKeys}
          className="tree-wrap"
          onExpand={this.onExpand}
          onSelect={this.onSelect}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onRightClick={this.onRightClick}
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
