import React from 'react'
import { Tree, Input, Spin, Menu, Modal } from 'antd'
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
    nodeList.push({ key: key.toString(), title })
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
    loadding: true,
    rightClickNodeTreeItem: {
      pageX: '',
      pageY: '',
      id: '',
      categoryName: ''
    },
    rightMenuStyle: { display: 'none' }
  }

  componentDidMount() {
    document.addEventListener('contextmenu', this._handleContextMenu)
    document.addEventListener('click', this._handleClick)

    this.getTreeData()
  }

  getTreeData = () => {
    const { apiMethod, treeRenderSuccess } = this.props
    if (!apiMethod) {
      throw new Error('没有树请求方法')
    }
    apiMethod()
      .then(res => {
        if (res.success) {
          const nodes = res.data
          /* const nodes = [
            {
              id: 'department1',
              key: 'department1',
              title: '用户组',
              parentId: null
            },
            {
              id: 'department2',
              key: 'department2',
              title: '成都研发中心',
              parentId: 'department1'
            },
            {
              id: 'department3',
              key: 'department3',
              title: '北京研发中心',
              parentId: 'department1'
            },
            {
              id: 'department4',
              key: 'department4',
              title: '前端组',
              parentId: 'department2'
            },
            {
              id: 'department5',
              key: 'department5',
              title: 'java组',
              parentId: 'department2'
            },
            {
              id: 'department6',
              key: 'department6',
              title: '前端组',
              parentId: 'department3'
            }
          ] */
          if (!Array.isArray(nodes) || !Object.keys(nodes[0]).includes('key')) {
            throw new Error('数据格式不符合')
          }
          const { allKey, nodeList } = generateList(nodes)
          this.setState({
            expandedKeys: allKey,
            selectedKeys: [nodes[0].key.toString()],
            nodeList,
            nodes,
            loading: false
          })
          treeRenderSuccess && treeRenderSuccess(nodes[0].key.toString())
        } else {
          this.nodes = []
          this.setState({ loading: false })
        }
      })
      .catch(e => {
        this.setState({ loading: false })
        console.log(e)
      })
  }

  _handleContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      rightMenuStyle: { display: 'none' }
    })
  }

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

  onSelect = (key, node) => {
    const { onSelect } = this.props
    onSelect && onSelect(key, node)
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
    console.log(e)
    e.event.preventDefault()
    e.event.stopPropagation()
    this.setState({
      rightClickNodeTreeItem: {
        pageX: e.event.pageX,
        pageY: e.event.pageY,
        id: e.node.props['data-key'],
        categoryName: e.node.props['data-title'],
        parentId: e.node.props.parentId
      },
      rightMenuStyle: {
        position: 'absolute',
        left: `${e.event.pageX - 230}px`,
        top: `${e.event.pageY - 115}px`,
        display: 'block'
      }
    })
  }

  showConfirm = () => {
    confirm({
      title: '确认删除该节点吗？',
      onOk() {
        console.log('OK')
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  deleteNode = e => {
    console.log(e)
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
              >
                修改
              </Menu.Item>
              <Menu.Item key="deleteNode" onClick={this.showConfirm}>
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
