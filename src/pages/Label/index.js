import React from 'react'
import { Button, message, notification, Modal } from 'antd'
import produce from 'immer'

import { Tablex, InnerPath } from '@/components'

import EditDrawer from './chip/EditDrawer'
import AddDrawer from './chip/AddDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import labelApi from '@/services/label'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
export default class Task extends React.Component {
  options = {
    title: '操作',
    dataIndex: 'opration',
    width: 120,
    render: (text, record) => {
      return (
        <span className="opration-btn">
          <a onClick={this.edit.bind(this, record)}>编辑</a>

          <a onClick={this.delete.bind(this, [record.id])}>删除</a>
        </span>
      )
    }
  }

  columnsArr = [...columns, this.options]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      rowKey: 'id',
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined,
    selection: [],
    selectData: [],
    disabledButton: {}
  }

  /**
   * @memberof Label
   * @description 根据选定数据判断按钮状态
   */
  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true
      }
    }
    this.setState({ disabledButton, selection, selectData })
  }

  /**
   * @memberof Task
   * @description 删除、编辑成功后回调
   */
  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  /**
   * @memberof Label
   * @description 新增标签
   */
  add = () => {
    this.setState({ inner: '新建' })
    this.addDrawer.pop()
    this.currentDrawer = this.addDrawer
  }

  /**
   * @memberof Label
   * @description 编辑标签
   */
  edit = record => {
    this.setState({ inner: '编辑' })
    this.editDrawer.pop(record)
    this.currentDrawer = this.editDrawer
  }

  /**
   * @memberof Label
   * @description 删除标签
   */
  delete = (id = undefined) => {
    const ids = id || this.state.selection
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise((resolve, reject) => {
          labelApi
            .delete({ taskIds: ids })
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
              error.type === 'timeout' &&
                self.tablex.refresh(self.state.tableCfg)
              resolve()
              console.log(error)
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
          location="标签管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={() => this.add()} type="primary">
                创建
              </Button>
              <Button
                onClick={() => this.delete()}
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
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
