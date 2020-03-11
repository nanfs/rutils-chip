import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import { Tablex, InnerPath } from '@/components'
import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import templateApi from '@/services/template'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
export default class Template extends React.Component {
  options = {
    title: '模板名称',
    dataIndex: 'name',
    render: (text, record) => {
      return (
        <a
          onClick={() => {
            this.setState({ inner: '模板详情' }, this.infoDrawer.pop(record))
            this.currentDrawer = this.infoDrawer
          }}
        >
          {text}
        </a>
      )
    }
  }

  columnsArr = [this.options, ...columns]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      expandedRowRender: false,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  editTem = () => {
    this.setState(
      { inner: '编辑模板' },
      this.editDrawer.pop(this.tablex.getSelectData()[0])
    )
    this.currentDrawer = this.editDrawer
  }

  delTem = () => {
    const selectTem = this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise((resolve, reject) => {
          templateApi
            .delTem({ ids: selectTem })
            .then(res => {
              if (res.success) {
                notification.success({ message: '删除成功' })
                self.tablex.refresh(self.state.tableCfg)
              } else {
                message.error(res.message || '删除失败')
              }
              resolve()
            })
            .catch(errors => {
              message.error(errors)
              resolve()
              console.log(errors)
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
    return (
      <React.Fragment>
        <InnerPath
          location="模板管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                onClick={this.editTem}
                disabled={
                  !this.state.selection || this.state.selection.length !== 1
                }
              >
                编辑模板
              </Button>
              <Button
                onClick={this.delTem}
                disabled={!this.state.selection || !this.state.selection.length}
              >
                删除模板
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
            onClose={this.onBack}
            onSuccess={() => {
              this.onBack()
              this.tablex.refresh(this.state.tableCfg)
            }}
          />
          <DetailDrawer
            onRef={ref => {
              this.infoDrawer = ref
            }}
            onClose={this.onBack}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
