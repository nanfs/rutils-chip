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
    // TODO详情页
    // render: (text, record) => {
    //   return (
    //     <a
    //       className="detail-link"
    //       onClick={() => this.detailDev(record.name, record)}
    //     >
    //       {record.name}
    //     </a>
    //   )
    // }
  }

  action = {
    title: '操作',
    dataIndex: 'opration',
    width: 130,
    render: (text, record) => {
      return (
        <span>
          <a
            style={{ marginRight: 16 }}
            onClick={this.delDev.bind(this, [record.id])}
          >
            删除
          </a>
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
                { inner: '编辑', initValues: selectDev },
                this.editDrawer.pop(selectDev)
              )

              this.currentDrawer = this.editDrawer
            }}
          >
            编辑
          </a>
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
    }),

    innerPath: undefined,
    initValues: {},
    disabledButton: {}
  }

  detailDev = (name, data) => {
    this.setState({ inner: name }, this.detailDrawer.pop(data.id, data))
    this.currentDrawer = this.detailDrawer
  }

  onSuccess = () => {
    this.setState({ inner: '' })
    this.currentDrawer.drawer.hide()
    this.tablex.refresh(this.state.tableCfg)
  }

  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length !== 1) {
      disabledButton = { ...disabledButton, disabledEdit: true }
    }
    if (selection.length === 0) {
      disabledButton = { ...disabledButton, disabledDelete: true }
    }
    // selectData.forEach(function(v, i) {
    //   if (v.boundTcNum !== 0) {
    //     disabledButton = { ...disabledButton, disabledDelete: true }
    //   }
    // })
    this.setState({ disabledButton })
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

  delDev = (id = undefined) => {
    const selectDev = id || this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise((resolve, reject) => {
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

  render() {
    const { disabledButton } = this.state
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
                disabled={disabledButton.disabledEdit}
              >
                编辑
              </Button>
              <Button
                onClick={() => this.delDev()}
                disabled={disabledButton.disabledDelete}
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
