import React from 'react'
import { TreeSelect, Input, Spin, Menu } from 'antd'
import { nodes2Tree } from '@/utils/tool'

export default class TreeSelectx extends React.Component {
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
              value: 'department1',
              title: '用户组',
              parentId: null
            },
            {
              id: 'department2',
              key: 'department2',
              title: '成都研发中心',
              value: 'department2',
              parentId: 'department1'
            },
            {
              id: 'department3',
              key: 'department3',
              title: '北京研发中心',
              value: 'department3',
              parentId: 'department1'
            },
            {
              id: 'department4',
              key: 'department4',
              title: '前端组',
              value: 'department4',
              parentId: 'department2'
            },
            {
              id: 'department5',
              key: 'department5',
              title: 'java组',
              value: 'department5',
              parentId: 'department2'
            },
            {
              id: 'department6',
              key: 'department6',
              title: '测试组',
              value: 'department6',
              parentId: 'department3'
            }
          ]
          if (!Array.isArray(nodes) || !Object.keys(nodes[0]).includes('key')) {
            throw new Error('数据格式不符合')
          }
          const treeData = nodes2Tree(nodes)
          this.setState({
            treeData
          })
        } else {
          this.treeData = []
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  componentDidUpdate(prep) {
    if (this.props.value !== prep.value) {
      this.setState({ value: this.props.value })
    }
  }

  render() {
    const { treeData } = this.state
    const { placeholder = '请选择', onChange = undefined } = this.props
    return (
      <TreeSelect
        style={{ width: '100%' }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={placeholder}
        treeDefaultExpandAll
        // showSearch={true}
        treeData={treeData}
        onChange={onChange}
        value={this.state.value}
      ></TreeSelect>
    )
  }
}
