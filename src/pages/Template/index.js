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
    ellipsis: true,
    render: (text, record) => {
      return (
        <a
          className="detail-link"
          onClick={() => {
            this.setState(
              { inner: text },
              this.infoDrawer.pop(record.id, record)
            )
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

  /**
   *
   *
   * @memberof Template
   * 返回后 将inner path 置为空
   */
  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  /**
   *
   *
   * @memberof Template
   * 成功后刷新表格
   */
  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  /**
   * @memberof Template
   * 编辑模板
   */
  editTem = () => {
    this.setState(
      { inner: '编辑模板' },
      this.editDrawer.pop(this.tablex.getSelectData()[0])
    )
    this.currentDrawer = this.editDrawer
  }

  /**
   * @memberof Template
   * 删除 批量删除
   */
  delTem = () => {
    const selectTem = this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise(resolve => {
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
                编辑
              </Button>
              <Button
                onClick={this.delTem}
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
