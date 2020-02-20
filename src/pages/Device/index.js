import React from 'react'
import { Button, message, Modal, notification } from 'antd'
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

  onSuccess = () => {
    this.setState({ inner: '' })
    this.addDrawer.drawer.hide()
    this.editDrawer.drawer.hide()
    this.tablex.refresh(this.state.tableCfg)
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
        { inner: '编辑', initValues: selectDev },
        this.editDrawer.drawer.show()
      )
      this.currentDrawer = this.editDrawer
    } else {
      message.warning('请选择一条数据进行编辑！')
    }
  }

  delDev = () => {
    const selectDev = this.tablex.getSelection()
    const self = this
    if (selectDev.length >= 1) {
      confirm({
        title: '确定删除所选数据?',
        onOk() {
          deviceApi
            .delDev({ ids: selectDev })
            .then(res => {
              if (res.success) {
                notification.success({ message: '删除成功' })
                self.onSuccess()
                self.tablex.clearSelection()
                self.setState({
                  selection: [],
                  selectData: []
                })
              } else {
                message.error(res.message || '删除失败')
              }
            })
            .catch(errors => {
              console.log(errors)
            })
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
              <Button onClick={this.addDev}>创建</Button>
              <Button
                onClick={this.editDev}
                disabled={
                  !this.state.selection || this.state.selection.length !== 1
                }
              >
                编辑
              </Button>
              <Button
                onClick={this.delDev}
                disabled={!this.state.selection || !this.state.selection.length}
              >
                删除
              </Button>
            </BarLeft>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
            onSelectChange={(selection, selectData) => {
              this.setState({ selection, selectData })
            }}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            initValues={this.state.initValues}
            onSuccess={this.onSuccess}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onSuccess={this.onSuccess}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
