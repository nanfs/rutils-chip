import React from 'react'
import { Button, DatePicker, notification, message, Modal } from 'antd'
import { Tablex, InnerPath, SelectSearch } from '@/components'
import { columns, apiMethod } from './chip/TableCfg'
import produce from 'immer'
import tclogsApi from '@/services/tclogs'

const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
const { RangePicker } = DatePicker
const { confirm } = Modal

export default class tcLog extends React.Component {
  constructor(props) {
    super(props)
    const defaultFilteredValue = []
    const defaultColumnsFilters = []
    for (const item of columns) {
      if (!['message', 'severity', 'logTime'].includes(item.dataIndex)) {
        defaultFilteredValue.push(item.dataIndex)
        defaultColumnsFilters.push({
          value: item.dataIndex,
          text: item.title()
        })
      }
    }

    this.action = {
      title: '操作',
      width: 80,
      dataIndex: 'action',
      defaultFilteredValue,
      filters: defaultColumnsFilters,
      render: (text, record) => {
        return (
          <span className="opration-btn">
            <a
              onClick={() =>
                this.deleteLogs(record.tcLogId, '确定删除本条数据?')
              }
            >
              删除
            </a>
          </span>
        )
      }
    }
    this.state = {
      tableCfg: createTableCfg({
        rowKey: 'tcLogId',
        columns: [...columns, this.action],
        apiMethod,
        paging: { size: 10 },
        pageSizeOptions: ['5', '10', '20', '50'],
        autoReplace: true
      }),
      disabledButton: {}
    }
  }

  searchOptions = [
    { label: '信息', value: 'message' },
    { label: '终端IP', value: 'tcIp' },
    { label: '终端SN', value: 'tcSn' },
    { label: '终端名称', value: 'tcName' },
    { label: '用户名', value: 'userName' },
    { label: '用户IP', value: 'userIp' }
  ]

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

  /**
   * 当搜索条件下来处理
   *
   * @memberof Vmlog
   */
  onSearchSelectChange = oldKey => {
    const searchs = { ...this.state.tableCfg.searchs }
    delete searchs[oldKey]
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...searchs
        }
      })
    )
  }

  /**
   *
   *
   * @memberof tcLog
   */
  onTableChange = (a, filter) => {
    const severityList = []
    filter.severity && severityList.push(...filter.severity)
    const columnsList = columns.filter(item =>
      filter.action.includes(item.dataIndex)
    )
    this.setState(
      produce(draft => {
        draft.tableCfg = {
          ...draft.tableCfg,
          columns: [
            columns[0],
            columns[1],
            columns[2],
            ...columnsList,
            this.action
          ],
          searchs: {
            ...draft.tableCfg.searchs,
            severity: severityList
          }
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  /**
   *
   *
   * @memberof tcLog
   */
  onSelectChange = selection => {
    let disabledButton = {}

    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true
      }
    }
    this.setState({ disabledButton })
  }

  /**
   *
   *
   * @memberof tcLog
   */
  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...searchs
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  /**
   *
   *
   * @memberof tcLog
   */

  deleteLogs = (id, text) => {
    const ids = Array.isArray(id) ? [...id] : [id]
    const self = this
    confirm({
      title: text || '确定删除所选数据?',
      onOk() {
        return new Promise(resolve => {
          tclogsApi
            .delete({ ids })
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

  /**
   *
   *
   * @memberof Vmlog
   *
   * 导出日志，支持导出指定时间范围内的日志
   */
  exportLogs = () => {
    const searchs = { ...this.state.tableCfg.searchs }
    tclogsApi
      .export({
        fromDate: searchs.fromDate || '',
        toDate: searchs.toDate || ''
      })
      .then(res => {
        if (res.byteLength) {
          // 创建隐藏的可下载链接
          const content = res
          const eleLink = document.createElement('a')
          eleLink.download = '系统日志-终端'
          eleLink.style.display = 'none'
          // 字符内容转变成blob地址
          const blob = new Blob([content], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          eleLink.href = URL.createObjectURL(blob)
          // 触发点击
          document.body.appendChild(eleLink)
          eleLink.click()
          // 然后移除
          document.body.removeChild(eleLink)
        } else {
          message.error(res.message || '导出失败')
        }
      })
      .catch(error => {
        message.error(error.message || error)
      })
  }

  // 加载后通过 tablex获取总数
  getTotal = () => {
    this.setState({ total: this.tablex.state.paging.total })
  }

  render() {
    const { disabledButton, total } = this.state
    return (
      <React.Fragment>
        <InnerPath location="系统日志-终端" />
        <TableWrap>
          <ToolBar>
            <BarLeft span={10}>
              <Button
                onClick={() => this.deleteLogs(this.tablex.getSelection())}
                disabled={disabledButton.disabledDelete}
              >
                删除
              </Button>
              <Button onClick={() => this.exportLogs()} disabled={!total}>
                导出
              </Button>
            </BarLeft>
            <BarRight span={14}>
              <RangePicker
                onChange={this.selectDate}
                showTime
                placeholder={['开始时间', '结束时间']}
              ></RangePicker>
              <SelectSearch
                options={this.searchOptions}
                onSelectChange={this.onSearchSelectChange}
                onSearch={this.search}
              ></SelectSearch>
            </BarRight>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
            onChange={this.onTableChange}
            onSelectChange={this.onSelectChange}
            afterLoad={this.getTotal}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
