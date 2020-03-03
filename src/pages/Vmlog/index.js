import React from 'react'
import { Button, DatePicker, notification, message, Modal } from 'antd'
import { Tablex, InnerPath, SelectSearch } from '@/components'
import { columns, apiMethod } from './chip/TableCfg'
import produce from 'immer'
import vmlogsApi from '@/services/vmlogs'

const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
const { RangePicker } = DatePicker
const { confirm } = Modal

export default class Vmlog extends React.Component {
  state = {
    tableCfg: createTableCfg({
      rowKey: 'auditLogId',
      columns,
      apiMethod,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    disbaledButton: {}
  }

  selectDate = rangeDate => {
    const [startDate, endDate] = rangeDate
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          fromDate:
            (startDate && startDate.format('YYYY-MM-DD HH:mm:ss')) || undefined,
          toDate:
            (endDate && endDate.format('YYYY-MM-DD HH:mm:ss')) || undefined
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          // ...draft.tableCfg.searchs,
          severity: draft.tableCfg.searchs.severity,
          ...searchs
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  onTableChange = (a, filter) => {
    const severityList = []
    severityList.push(...filter.severity)
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          severity: severityList
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  onSelectChange = selection => {
    let disbaledButton = {}
    if (selection.length === 0) {
      disbaledButton = {
        ...disbaledButton,
        disabledDelete: true
      }
    }
    this.setState({ disbaledButton })
  }

  deleteLogs = () => {
    const ids = this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        vmlogsApi
          .delete({ ids })
          .then(res => {
            if (res.success) {
              notification.success({ message: '删除成功' })
              self.tablex.refresh(self.state.tableCfg)
            } else {
              message.error(res.message || '删除失败')
            }
          })
          .catch(errors => {
            message.error(errors)
            console.log(errors)
          })
      },
      onCancel() {}
    })
  }

  render() {
    const searchOptions = [
      { label: '信息', value: 'message' },
      { label: '用户', value: 'userName' },
      { label: '桌面名称', value: 'desktopName' },
      { label: '数据中心名称', value: 'datacenterName' },
      { label: '集群名称', value: 'clusterName' },
      { label: '主机名', value: 'hostName' }
    ]
    const { disbaledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath location="系统日志-桌面" />
        <TableWrap>
          <ToolBar>
            <BarLeft span={10}>
              <Button
                onClick={this.deleteLogs}
                disabled={disbaledButton.disabledDelete}
              >
                删除
              </Button>
            </BarLeft>
            <BarRight span={14}>
              <RangePicker onChange={this.selectDate} showTime></RangePicker>
              <SelectSearch
                options={searchOptions}
                onSearch={this.search}
              ></SelectSearch>
            </BarRight>
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
