import React from 'react'
import { Button, message, Modal, notification, Select } from 'antd'
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
    initValues: {},
    disbaledButton: {}
  }

  onSuccess = () => {
    this.setState({ inner: '' })
    this.currentDrawer.drawer.hide()
    this.tablex.refresh(this.state.tableCfg)
  }

  onSelectChange = (selection, selectData) => {
    let disbaledButton = {}
    if (selection.length !== 1) {
      disbaledButton = { ...disbaledButton, disabledEdit: true }
    }
    if (selection.length === 0) {
      disbaledButton = { ...disbaledButton, disabledDelete: true }
    }
    selectData.forEach(function(v, i) {
      if (v.boundTcNum !== 0) {
        disbaledButton = { ...disbaledButton, disabledDelete: true }
      }
    })
    this.setState({ disbaledButton })
  }

  onBack = () => {
    this.setState({ inner: undefined })
    // this.tablex.clearSelection()
    this.currentDrawer.drawer.hide()
  }

  addDev = () => {
    this.setState({ inner: '创建' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  editDev = () => {
    let selectDev = {}
    if (this.tablex.getSelection().length === 1) {
      selectDev = this.tablex.getSelectData()[0]
      const initKeys = []
      selectDev.usbs.forEach(function(v, i) {
        initKeys.push(i)
      })
      if (initKeys.length) {
        selectDev.initKeys = initKeys
      } else {
        selectDev.initKeys = [0]
      }
      this.setState(
        { inner: '编辑', initValues: selectDev },
        // this.editDrawer.drawer.show()
        this.editDrawer.pop(selectDev)
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
                self.tablex.refresh(self.state.tableCfg)
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
    const { disbaledButton } = this.state
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
                disabled={disbaledButton.disabledEdit}
              >
                编辑
              </Button>
              <Button
                onClick={this.delDev}
                disabled={disbaledButton.disabledDelete}
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
            onSelectChange={this.onSelectChange}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            onClose={this.onBack}
            initValues={this.state.initValues}
            onSuccess={this.onSuccess}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
