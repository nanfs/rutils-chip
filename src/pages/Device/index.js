import React from 'react'
import { Button, message, Modal } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'
import EditDrawer from './chip/EditDrawer'
import AddDrawer from './chip/AddDrawer'
import InnerPath from '@/components/InnerPath'
import { columns, apiMethod } from './chip/TableCfg'
import deviceApi from '@/services/device'

const { confirm } = Modal

export default class Device extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      expandedRowRender: false,
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

  addDev = () => {
    this.setState({ inner: '创建' }, this.addDrawer.drawer.show())
    this.currentDrawer = this.addDrawer
  }

  editDev = () => {
    let selectDev = {}
    if (this.tablex.getSelection().length === 1) {
      selectDev = this.tablex.getSelectData()[0]
      const initKeys = []
      if (selectDev.isUsagePeripherals == '0') {
        selectDev.isUsagePeripherals = false
      } else {
        selectDev.isUsagePeripherals = true
      }
      selectDev.usbs.forEach(function(v, i) {
        initKeys.push(i)
      })
      selectDev.initKeys = initKeys
      selectDev.initId = initKeys.length - 1
      this.setState(
        { inner: '编辑模板', initValues: selectDev },
        this.editDrawer.drawer.show()
      )
      this.currentDrawer = this.editDrawer
    } else {
      message.warning('请选择一条数据进行编辑！')
    }
  }

  delDev = () => {
    const selectDev = this.tablex.getSelection()
    if (selectDev.length >= 1) {
      confirm({
        title: '确定删除所选数据?',
        onOk() {
          deviceApi.delDev({ ids: JSON.stringify(selectDev) })
        },
        onCancel() {}
      })
    } else {
      message.warning('请选择一条数据进行删除！')
    }
  }

  render() {
    return (
      <React.Fragment>
        <InnerPath
          location="外设控制"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.addDev} style={{ marginRight: '10px' }}>
                创建
              </Button>
              <Button onClick={this.editDev} style={{ marginRight: '10px' }}>
                编辑
              </Button>
              <Button onClick={this.delDev}>删除</Button>
            </BarLeft>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            initValues={this.state.initValues}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
