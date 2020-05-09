import React from 'react'
import { Tree, Input, Spin, Menu, Modal, notification, message } from 'antd'
import { nodes2Tree } from '@/utils/tool'

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
export default class SetRoleTree extends React.Component {
  state = {
    value: '',
    searchValue: '',
    autoExpandParent: true,
    expandedKeys: [],
    checkedKeys: [],
    selectedKeys: [],
    nodeList: [],
    nodes: undefined,
    loadding: true
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  componentDidUpdate(prep) {
    if (this.props.treeData !== prep.value && prep.treeData === undefined) {
      this.setState({ nodes: this.props.treeData })
    }
  }

  getTreeData = userId => {
    const { apiMethod, treeData } = this.props
    if (!apiMethod) {
      this.setState({
        nodes: treeData,
        loading: false
      })
      return false
    }
    apiMethod({ userId })
      .then(res => {
        if (res.success) {
          const nodes = res.data.map(element => {
            if (element.type === 1) {
              element.rank = 1
            } else if (element.type === 14) {
              element.rank = 2
            } else if (element.type === 9) {
              element.rank = 3
            }
            return {
              ...element,
              key: element.id.toString(),
              id: element.id.toString(),
              value: element.id.toString(),
              title: element.name,
              parentId: element.pid ? element.pid.toString() : '-1'
            }
          })
          nodes.sort((a, b) => {
            return a.rank - b.rank
          })
          if (!Array.isArray(nodes) || !Object.keys(nodes[0]).includes('key')) {
            throw new Error('数据格式不符合')
          }
          const { allKey, nodeList } = generateList(nodes)
          this.setState({
            expandedKeys: allKey,
            nodeList,
            nodes,
            loading: false
          })
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

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  }

  // 树节点选中
  onCheck = (checkedKeys, node) => {
    const { onCheck } = this.props
    this.setState({ checkedKeys })
    onCheck && onCheck(checkedKeys, node)
  }

  renderTreeNode = (data, searchValue = '') =>
    data.map(item => {
      const index = item.title.indexOf(searchValue)
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
        />
      )
    })

  clean = () => {
    this.setState({
      checkedKeys: [],
      selectedKeys: []
    })
  }

  render() {
    const { showSearch = true, checkable = false, onCheck } = this.props
    // console.log(rightClickNodeTreeItem)
    // const { pageX, pageY, id, categoryName } = rightClickNodeTreeItem

    const {
      searchValue,
      expandedKeys,
      checkedKeys,
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
          checkedKeys={checkedKeys}
          selectedKeys={selectedKeys}
          className="tree-wrap"
          onExpand={this.onExpand}
          onCheck={this.onCheck}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          checkStrictly
          checkable={checkable}
        >
          {this.renderTreeNode(nodes2Tree(nodes), searchValue)}
        </Tree>
      </Spin>
    )
  }
}
