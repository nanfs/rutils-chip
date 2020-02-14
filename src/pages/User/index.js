import React from 'react'
import { Button, message, notification, TreeSelect, Row, Col } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import InnerPath from '@/components/InnerPath'
import { columns, apiMethod } from './chip/TableCfg'
import './index.scss'
import terminalApi from '@/services/terminal'

const { TreeNode } = TreeSelect
export default class User extends React.Component {
  constructor(props) {
    super(props)
    columns.push({
      title: '操作',
      dataIndex: 'opration',
      className: 'opration',
      render: (text, record) => (
        <div>
          <Button
            onClick={this.sendOrder.bind(this, record.id, 'turnOn')}
            icon="user"
          />
          <Button
            onClick={this.sendOrder.bind(this, record.id, 'turnOff')}
            icon="user"
          />
          <Button onClick={this.detailVm}>详情</Button>
        </div>
      )
    })
  }

  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    }),
    innerPath: undefined,
    initValues: {},
    value: undefined
  }

  sendOrder = (id, order) => {
    console.log('sendOrder', id, order)
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  editTerminal = () => {
    this.setState(
      { inner: '编辑终端', initValues: this.state.selectData[0] },
      this.editDrawer.drawer.show()
    )
    this.currentDrawer = this.editDrawer
  }

  onChange = value => {
    console.log(value)
    this.setState({ value })
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col span={4}>
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={this.state.value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              treeDefaultExpandAll
              onChange={this.onChange}
            >
              <TreeNode value="parent 1" title="parent 1" key="0-1">
                <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                  <TreeNode value="leaf1" title="my leaf" key="random" />
                  <TreeNode value="leaf2" title="your leaf" key="random1" />
                </TreeNode>
                <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                  <TreeNode
                    value="sss"
                    title={<b style={{ color: '#08c' }}>sss</b>}
                    key="random3"
                  />
                </TreeNode>
              </TreeNode>
            </TreeSelect>
          </Col>
          <Col span={20}>
            <InnerPath
              location="用户管理"
              inner={this.state.inner}
              onBack={this.onBack}
            />
            <TableWrap>
              <ToolBar>
                <BarLeft>
                  <Button
                    onClick={this.editTerminal}
                    disabled={
                      !this.state.selection || this.state.selection.length !== 1
                    }
                  >
                    编辑
                  </Button>
                  <Button onClick={this.admitAccessTerminal}>允许接入</Button>
                  <Button onClick={this.onTerminal}>开机</Button>
                  <Button onClick={this.offTerminal}>关机</Button>
                  <Button onClick={this.detailTerminal}>查看详情</Button>
                </BarLeft>
                <BarRight>
                  <Button>删除</Button>
                </BarRight>
              </ToolBar>
              <Tablex
                onRef={ref => {
                  this.tablex = ref
                }}
                className="no-select-bg"
                tableCfg={this.state.tableCfg}
                onSelectChange={(selection, selectData) => {
                  this.setState({ selection, selectData })
                }}
              />
            </TableWrap>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
