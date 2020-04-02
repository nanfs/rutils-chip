import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import { Tablex, InnerPath } from '@/components'
import EditDrawer from './chip/EditDrawer'
import AddDrawer from './chip/AddDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import deviceApi from '@/services/device'
import DetailDrawer from './chip/DetailDrawer'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex

export default class Device extends React.Component {
  vmName = {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true
  }

  action = {
    title: '操作',
    dataIndex: 'opration',
    width: 130,
    render: (text, record) => {
      return (
        <span className="opration-btn">
          <a
            onClick={() => {
              const selectDev = record
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
                { inner: record.name, initValues: selectDev },
                this.editDrawer.pop(selectDev)
              )

              this.currentDrawer = this.editDrawer
            }}
          >
            编辑
          </a>
          <a onClick={() => this.delDev(record.id)}>删除</a>
        </span>
      )
    }
  }

  columnsArr = [this.vmName, ...columns, this.action]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      expandedRowRender: false,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    })
  }

  onSelectChange = selection => {
    let disabledButton = {}
    if (selection.length !== 1) {
      disabledButton = { ...disabledButton, disabledEdit: true }
    }
    if (selection.length === 0) {
      disabledButton = { ...disabledButton, disabledDelete: true }
    }
    this.setState({ disabledButton })
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
        this.editDrawer.pop(selectDev)
      )

      this.currentDrawer = this.editDrawer
    } else {
      message.warning('请选择一条数据进行编辑！')
    }
  }

  delDev = (id, title = '确定删除所选数据?') => {
    const ids = Array.isArray(id) ? id : [id]
    const self = this
    confirm({
      title,
      onOk() {
        return new Promise(resolve => {
          deviceApi
            .delDev({ ids })
            .then(res => {
              if (res.success) {
                notification.success({ message: '删除成功' })
                self.tablex.refresh(self.state.tableCfg)
              } else {
                message.error(res.message || '删除失败')
              }
              resolve()
            })
            .catch(error => {
              message.error(error.message || error)
              console.log(error)
              resolve()
            })
        })
      },
      onCancel() {}
    })
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  onSuccess = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
    this.tablex.refresh(this.state.tableCfg)
  }

  render() {
    const { disabledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath
          location="外设控制"
          inner={this.state?.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.addDev}>创建</Button>
              <Button
                onClick={() => this.delDev(this.tablex.selection())}
                disabled={disabledButton?.disabledDelete}
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
            onSuccess={this.onSuccess}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
          />
          <DetailDrawer
            onRef={ref => {
              this.detailDrawer = ref
            }}
            onClose={this.onBack}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
