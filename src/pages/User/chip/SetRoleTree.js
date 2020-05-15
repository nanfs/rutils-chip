import React from 'react'
import { Tree, Input, Spin, Menu, Modal, notification, message } from 'antd'
import { nodes2Tree } from '@/utils/tool'
import userApi from '@/services/user'

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
    nodeAsTree: [],
    loadding: true,
    disabledKeys: []
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  /* componentDidUpdate(prep) {
    if (this.props.treeData !== prep.value && prep.treeData === undefined) {
      this.setState({ nodes: this.props.treeData })
    }
  } */

  familyTree(arr1, id) {
    const temp = []
    const forFn = function(arr, key) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item.id === key) {
          temp.push(item.id)
          forFn(arr1, item.parentId)
          break
        } else if (item.children) {
          forFn(item.children, key)
        }
      }
    }
    forFn(arr1, id)
    return temp
  }

  childrenTree(arr1, id) {
    const temp = []
    const forFn = function(arr, key) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item.parentId === key) {
          temp.push(item.id)
          if (item.children) {
            forFn(item.children, item.id)
          }
          // break
        } else if (item.children) {
          forFn(item.children, key)
        }
      }
    }
    forFn(arr1, id)
    return temp
  }

  // 获取多个节点的相关节点（多级父节点，多级子节点） 设置为disabled
  getrelatedNodes = nodes => {
    const disabledKeys = []
    console.log(nodes.checkedNodes, this.state.nodeAsTree)
    nodes.checkedNodes.forEach(element => {
      disabledKeys.push(
        ...this.childrenTree(this.state.nodeAsTree, element.props['data-key']),
        ...this.familyTree(this.state.nodeAsTree, element.props.parentId)
      )
    })
    const { loginUserNodes } = this.state
    loginUserNodes.forEach(element => {
      disabledKeys.push(
        ...this.familyTree(this.state.nodeAsTree, element.props.parentId)
      )
    })

    this.setState({ disabledKeys })
  }

  getTreeData = (userId, checkedKeys, loginUserResource) => {
    const { apiMethod, treeData, treeRenderSuccess } = this.props
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
          const nodes = []
          const checkedNodes = []
          const loginUserNodes = []
          res.data.forEach(element => {
            if (element.type === 1) {
              element.rank = 1
              element.title = element.name
              element.relatedNodes = []
            } else if (element.type === 14) {
              element.rank = 2
              element.title = `${element.name}(数据中心)`
            } else if (element.type === 9) {
              element.rank = 3
              element.title = `${element.name}(集群)`
            }
            element.parentId = element.pid ? element.pid.toString() : '-1'
            nodes.push({
              ...element,
              key: element.id.toString(),
              id: element.id.toString(),
              value: element.id.toString()
            })
            if (checkedKeys.indexOf(element.id) > -1) {
              checkedNodes.push({
                props: { parentId: element.parentId, 'data-key': element.id }
              })
            }
            if (loginUserResource.indexOf(element.id) > -1) {
              loginUserNodes.push({
                props: { parentId: element.parentId, 'data-key': element.id }
              })
            }
          })

          nodes.sort((a, b) => {
            return a.rank - b.rank
          })
          if (!Array.isArray(nodes) || !Object.keys(nodes[0]).includes('key')) {
            throw new Error('数据格式不符合')
          }
          const { allKey, nodeList } = generateList(nodes)
          treeRenderSuccess && treeRenderSuccess(allKey)
          this.setState({
            expandedKeys: allKey,
            nodeAsTree: nodes2Tree(nodes),
            checkedKeys,
            loginUserNodes,
            nodeList,
            nodes,
            loading: false
          })

          this.getrelatedNodes({ checkedNodes }) // 初始化时将已选节点的相关节点disabled
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
    onCheck && onCheck(checkedKeys, node)
    this.getrelatedNodes(node)
    this.setState({ checkedKeys })
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
      const disabled = this.state.disabledKeys.indexOf(item.id) > -1
      if (item.children) {
        return (
          <TreeNode
            key={item.id}
            title={title}
            data-key={item.id}
            data-title={item.title}
            parentId={item.parentId}
            type={item.type}
            disabled={disabled}
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
          type={item.type}
          parentId={item.parentId}
          disabled={disabled}
        />
      )
    })

  clean = () => {
    this.setState({
      checkedKeys: [],
      selectedKeys: [],
      disabledKeys: []
    })
  }

  render() {
    const { showSearch = true, checkable = false, onCheck } = this.props
    // console.log(rightClickNodeTreeItem)
    // const { pageX, pageY, id, categoryName } = rightClickNodeTreeItem

    const {
      nodeAsTree,
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
          {this.renderTreeNode(nodeAsTree, searchValue)}
        </Tree>
      </Spin>
    )
  }
}
