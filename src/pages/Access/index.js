import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import InnerPath from '@/components/InnerPath'
import { columns, apiMethod } from './chip/TableCfg'
import accessApi from '@/services/access'
import moment from 'moment'

const { confirm } = Modal

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

  delAccess = () => {
    const ids = this.tablex.getSelection()
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        accessApi.del({ ids }).then(res => {
          if (res.success) {
            notification.success({ message: '删除成功' })
            this.onSuccess()
          } else {
            message.error(res.message || '删除失败')
          }
        })
      },
      onCancel() {}
    })
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
  }

  render() {
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
              <Button onClick={this.editAccess}>编辑</Button>
              <Button onClick={this.delAccess}>删除</Button>
            </BarLeft>
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
            onSuccess={this.onSuccess}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            onSuccess={this.onSuccess}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
