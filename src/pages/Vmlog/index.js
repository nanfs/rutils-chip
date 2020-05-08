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
  constructor(props) {
    super(props)
    columns[0].defaultFilteredValue = props.location?.searchs?.severity
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
                this.deleteLogs(record.auditLogId, '确定删除本条数据?')
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
        rowKey: 'auditLogId',
        columns: [...columns, this.action],
        apiMethod,
        searchs: this.props.location?.searchs, // 接受传递过来搜索条件
        paging: { size: 10 },
        pageSizeOptions: ['5', '10', '20', '50']
      }),
      disabledButton: {}
    }
  }

  searchOptions = [
    { label: '信息', value: 'message' },
    { label: '用户', value: 'userName' },
    { label: '桌面名称', value: 'desktopName' },
    { label: '数据中心', value: 'datacenterName' },
    { label: '集群名称', value: 'clusterName' },
    { label: '主机名', value: 'hostName' }
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
   *
   *
   * @memberof Vmlog
   */
  onTableChange = (page, filter) => {
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
   * @memberof Vmlog
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
   * @memberof Vmlog
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

  deleteLogs = (id, text) => {
    const ids = Array.isArray(id) ? [...id] : [id]
    const self = this
    confirm({
      title: text || '确定删除所选数据?',
      onOk() {
        return new Promise(resolve => {
          vmlogsApi
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
    vmlogsApi
      .export([searchs.fromDate, searchs.toDate])
      .then(res => {
        if (res.success) {
          // 创建隐藏的可下载链接
          const content = res.data
          const eleLink = document.createElement('a')
          eleLink.download = '系统日志-桌面'
          eleLink.style.display = 'none'
          // 字符内容转变成blob地址
          const blob = new Blob([content])
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

  render() {
    const { disabledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath location="系统日志-桌面" />
        <TableWrap>
          <ToolBar>
            <BarLeft span={10}>
              <Button
                onClick={() => this.deleteLogs(this.tablex.getSelection())}
                disabled={disabledButton.disabledDelete}
              >
                删除
              </Button>
              <Button onClick={() => this.exportLogs()}>导出</Button>
            </BarLeft>
            <BarRight span={14}>
              <RangePicker
                onChange={this.selectDate}
                showTime
                placeholder={['开始时间', '结束时间']}
              ></RangePicker>
              <SelectSearch
                defaultValue={this.props.location?.searchs?.message}
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
            autoReplace={true}
            tableCfg={this.state.tableCfg}
            onSelectChange={this.onSelectChange}
            onChange={this.onTableChange}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
