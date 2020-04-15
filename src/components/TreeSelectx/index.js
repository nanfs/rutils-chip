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

  componentDidUpdate(prep) {
    if (this.props.nodeData !== prep.nodeData) {
      const treeData = nodes2Tree(this.props.nodeData)
      this.setState({ treeData })
    }
    if (this.props.value !== prep.value) {
      this.setState({ value: this.props.value })
    }
  }

  render() {
    const { treeData } = this.state
    const {
      placeholder = '请选择',
      onChange = undefined,
      disabled
    } = this.props
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
        disabled={disabled}
      ></TreeSelect>
    )
  }
}
