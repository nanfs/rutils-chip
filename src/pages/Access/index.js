import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import { Tablex, InnerPath } from '@/components'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import accessApi from '@/services/access'
import DetailDrawer from './chip/DetailDrawer'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
export default class Desktop extends React.Component {
  accessName = {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true
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
            onClick={() => {
              this.delAccess([record.id])
            }}
          >
            删除
          </a>
          <a
            onClick={() => {
              this.setState({ inner: '编辑' }, this.editDrawer.pop(record))
              this.currentDrawer = this.editDrawer
            }}
          >
            编辑
          </a>
        </span>
      )
    }
  }

  columnsArr = [this.accessName, ...columns, this.action]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
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

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length !== 1) {
      disabledButton = { ...disabledButton, disabledEdit: true }
    }
    if (selection.length === 0) {
      disabledButton = { ...disabledButton, disabledDelete: true }
    }
    selectData.forEach(function(v, i) {
      if (v.boundTcNum !== 0) {
        disabledButton = { ...disabledButton, disabledDelete: true }
      }
    })
    this.setState({ disabledButton })
  }

  addAccess = () => {
    this.setState({ inner: '创建' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  editAccess = () => {
    if (this.tablex.getSelection().length === 1) {
      this.setState(
        { inner: '编辑' },
        this.editDrawer.pop(this.tablex.getSelectData()[0])
      )
      this.currentDrawer = this.editDrawer
    } else {
      message.warning('请选择一条数据进行编辑！')
    }
  }

  delAccess = (id = undefined) => {
    const ids = id || this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise((resolve, reject) => {
          accessApi
            .del({ ids })
            .then(res => {
              if (res.success) {
                notification.success({ message: '删除成功' })
                self.onSuccess()
              } else {
                message.error(res.message || '删除失败')
              }
              resolve()
            })
            .catch(error => {
              message.error(error.message || error)
              resolve()
              console.log(error)
            })
        })
      },
      onCancel() {}
    })
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  render() {
    const { disabledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath
          location="准入控制"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.addAccess}>创建</Button>
              <Button
                onClick={this.editAccess}
                disabled={disabledButton.disabledEdit}
              >
                编辑
              </Button>
              <Button
                onClick={() => this.delAccess()}
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
            onSelectChange={this.onSelectChange}
            tableCfg={this.state.tableCfg}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
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
