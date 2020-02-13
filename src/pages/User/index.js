import React from 'react'
import { Button, message, notification } from 'antd'
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
    initValues: {}
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

  render() {
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  }
}
