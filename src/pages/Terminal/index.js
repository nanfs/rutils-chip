import React from 'react'
import { Button, message } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import InnerPath from '@/components/InnerPath'
import { columns, apiMethod } from './chip/TableCfg'
import './index.scss'
import Item from 'antd/lib/list/Item'

export default class Desktop extends React.Component {
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

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  newTerminal = () => {
    this.setState({ inner: '新建终端' }, this.addDrawer.drawer.show())
    this.currentDrawer = this.addDrawer
  }

  editTerminal = () => {
    let selectTem = {}
    if (this.tablex.getSelection().length === 1) {
      this.tablex.getData().forEach(item => {
        if (item.id === this.tablex.getSelection()[0]) {
          selectTem = item
        }
      })
      this.setState(
        { inner: '编辑模板', initValues: selectTem },
        this.editDrawer.drawer.show()
      )
      this.currentDrawer = this.editDrawer
    } else {
      message.warning('请选择一条数据进行编辑！')
    }
  }

  render() {
    return (
      <React.Fragment>
        <InnerPath
          location="终端管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.newTerminal}>新建</Button>
              <Button onClick={this.editTerminal}>编辑</Button>
              <Button onClick={this.newTerminal}>允许接入</Button>
              <Button onClick={this.newTerminal}>开机</Button>
              <Button onClick={this.newTerminal}>关机</Button>
              {/* <Button onClick={this.newTerminal}>操作</Button> */}
            </BarLeft>
            <BarRight>
              <Button>删除</Button>
            </BarRight>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            initValues={this.state.initValues}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
