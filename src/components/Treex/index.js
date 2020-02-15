import React from 'react'
import { Tree, Input, Spin } from 'antd'
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
    allKey.push(key)
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
    nodeList: [],
    loadding: true
  }

  componentDidMount() {
    const { apiMethod } = this.props
    if (!apiMethod) {
      throw new Error('没有树请求方法')
    }
    apiMethod()
      .then(res => {
        if (res.success) {
          // const nodes = res.data
          const nodes = [
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
          ]
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
      .catch(e => {
        this.setState({ loading: false })
        console.log(e)
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
          <TreeNode key={item.id} title={title}>
            {this.renderTreeNode(item.children, searchValue)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.id} title={title} />
    })

  render() {
    const { showSearch = true } = this.props
    const {
      searchValue,
      expandedKeys,
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
          className="tree-wrap"
          onExpand={this.onExpand}
          onSelect={this.onSelect}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        >
          {this.renderTreeNode(nodes2Tree(nodes), searchValue)}
        </Tree>
      </Spin>
    )
  }
}
