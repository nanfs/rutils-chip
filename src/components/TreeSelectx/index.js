import React from 'react'
import { TreeSelect } from 'antd'
import { nodes2Tree } from '@/utils/tool'

export default class TreeSelectx extends React.Component {
  state = {
    value: '',
    searchValue: '',
    autoExpandParent: true,
    expandedKeys: [],
    nodeList: [],
    loadding: true,
    treeData: []
  }

  componentDidMount() {
    const { apiMethod, nodeData } = this.props
    if (!Array.isArray(nodeData) || !Object.keys(nodeData[0]).includes('key')) {
      throw new Error('数据格式不符合')
    }
    const treeData = nodes2Tree(nodeData)
    this.setState({
      treeData
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
