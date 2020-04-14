import React from 'react'
import { Button, message, notification, Modal } from 'antd'
import produce from 'immer'

import { Tablex, InnerPath, SelectSearch } from '@/components'

import EditDrawer from './chip/EditDrawer'
import AddDrawer from './chip/AddDrawer'
import DetailDrawer from './chip/DetailDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import taskApi from '@/services/task'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
export default class Task extends React.Component {
  options = {
    title: '操作',
    dataIndex: 'opration',
    width: 120,
    render: (text, record) => {
      return (
        <span className="opration-btn">
          <a onClick={this.editTask.bind(this, record)}>编辑</a>

          <a onClick={this.deleteTask.bind(this, [record.id])}>删除</a>
        </span>
      )
    }
  }

  taskName = {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'name',
    render: (text, record) => {
      return (
        <a
          className="detail-link"
          onClick={() => this.detailTask(record.name, record)}
        >
          {record.name}
        </a>
      )
    }
  }

  columnsArr = [this.taskName, ...columns, this.options]

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
   * @memberof Task
   * @description 根据选定数据判断按钮状态
   */
  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true,
        disabledAdmit: true,
        disabledForbid: true
      }
    }
    selectData.forEach(item => {
      if (item.status === 1) {
        disabledButton = {
          ...disabledButton,
          disabledAdmit: true
        }
      } else {
        disabledButton = {
          ...disabledButton,
          disabledForbid: true
        }
      }
    })
    this.setState({ disabledButton, selection, selectData })
  }

  /**
   * @memberof Task
   * @description 表格onChange的回调
   */
  onTableChange = (a, filter) => {
    const statusList = []
    filter.status &&
      filter.status.forEach(function(v, i) {
        statusList.push(...v)
      })
    const isRegList = []
    filter.isReg &&
      filter.isReg.forEach(function(v, i) {
        isRegList.push(...v)
      })
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          status: statusList,
          isReg: isRegList
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  /**
   * @memberof Task
   * @description 表格搜索
   */
  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          status: draft.tableCfg.searchs.status,
          isReg: draft.tableCfg.searchs.isReg,
          ...searchs
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
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

  detailTask = (name, data) => {
    this.setState({ inner: name })
    this.infoDrawer.pop(data)
    this.currentDrawer = this.infoDrawer
  }

  /**
   * @memberof Task
   * @description 允许任务
   */
  admit = () => {
    const ids = this.state.selection
    taskApi
      .admitTask({ taskIds: ids })
      .then(res => {
        if (res.success) {
          notification.success({ message: '操作成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '操作失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  /**
   * @memberof Task
   * @description 禁用任务
   */
  forbid = () => {
    const ids = this.state.selection
    taskApi
      .forbidTask({ taskIds: ids })
      .then(res => {
        if (res.success) {
          notification.success({ message: '操作成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '操作失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  addTask = () => {
    this.setState({ inner: '新建任务' })
    this.addDrawer.pop()
    this.currentDrawer = this.addDrawer
  }

  editTask = record => {
    this.setState({ inner: '编辑任务' })
    this.editDrawer.pop(record)
    this.currentDrawer = this.editDrawer
  }

  /**
   * @memberof Task
   * @description 删除任务
   */
  deleteTask = (id = undefined) => {
    const ids = id || this.state.selection
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise((resolve, reject) => {
          taskApi
            .deleteTask({ taskIds: ids })
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
    const { disabledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath
          location="计划任务"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={() => this.addTask()} type="primary">
                创建
              </Button>
              <Button
                onClick={() => this.deleteTask()}
                disabled={disabledButton.disabledDelete}
              >
                删除
              </Button>
              <Button
                onClick={() => this.admit()}
                disabled={disabledButton.disabledAdmit}
              >
                启用
              </Button>
              <Button
                onClick={() => this.forbid()}
                disabled={disabledButton.disabledForbid}
              >
                停用
              </Button>
            </BarLeft>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
            onSelectChange={this.onSelectChange}
            onChange={this.onTableChange}
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
