import React from 'react'
import { Button, message, notification, Modal } from 'antd'
import produce from 'immer'

import { Tablex, InnerPath, SelectSearch } from '@/components'
import { columns, apiMethod } from './chip/TableCfg'
import taskApi from '@/services/terminalTask'
import { wrapResponse } from '@/utils/tool'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
export default class Task extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
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
        disabledDelete: true
      }
    }
    this.setState({ disabledButton, selection, selectData })
  }

  /**
   * @memberof Task
   * @description 表格onChange的回调
   */
  onTableChange = (a, filter) => {
    const taskTypeList = []
    filter.taskType &&
      filter.taskType.forEach(function(v, i) {
        taskTypeList.push(...v)
      })
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          taskTypes: taskTypeList
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
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
          taskTypes: draft.tableCfg.searchs.taskTypes,
          ...searchs
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
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
        taskApi
          .deleteTask({ ids })
          .then(res => {
            wrapResponse(res).then(() => {
              notification.success({ message: '删除成功' })
              self.tablex.refresh(self.state.tableCfg)
            })
          })
          .catch(error => {
            message.error(error.message || error)
            error.type === 'timeout' && self.tablex.refresh(self.state.tableCfg)
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
          location="终端任务"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                onClick={() => this.deleteTask()}
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
            onChange={this.onTableChange}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
