import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'
import EditDrawer from './chip/EditDrawer'
import InnerPath from '@/components/InnerPath'
import { columns, apiMethod } from './chip/TableCfg'
import templateApi from '@/services/template'

const { confirm } = Modal

export default class Template extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      expandedRowRender: false,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10']
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
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        templateApi
          .delTem({ ids: selectTem })
          .then(res => {
            if (res.success) {
              notification.success({ message: '删除成功' })
              this.tablex.refresh(this.state.tableCfg)
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
              this.tablex.refresh(this.state.tableCfg)
            }}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
