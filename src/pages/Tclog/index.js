import React from 'react'
import { Button, DatePicker, notification, message } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import InnerPath from '@/components/InnerPath'
import SelectSearch from '@/components/SelectSearch'
import { columns, apiMethod } from './chip/TableCfg'
import produce from 'immer'
import tclogsApi from '@/services/tclogs'

const { RangePicker } = DatePicker

export default class tcLog extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 10 },
      pageSizeOptions: ['10', '20', '50']
    }),
    disbaledButton: {}
  }

  selectDate = rangeDate => {
    const [startDate, endDate] = rangeDate
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          fromDate: startDate.format('YYYY-MM-DD'),
          toDate: endDate.format('YYYY-MM-DD')
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
          ...draft.tableCfg.searchs,
          ...searchs
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  onTableChange = (a, filter) => {
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...filter
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
    tclogsApi
      .delete({ ids })
      .then(res => {
        if (res.success) {
          notification.success({ message: '删除成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '删除失败')
        }
      })
      .catch(errors => {
        message.error(errors)
        console.log(errors)
      })
  }

  render() {
    const searchOptions = [
      { label: '信息', value: 'message' },
      { label: '终端ip', value: 'tcip' },
      { label: '终端序列号', value: 'tcSn' },
      { label: '终端名称', value: 'tcName' },
      { label: '用户名', value: 'userName' },
      { label: '用户ip', value: 'userip' }
    ]
    const { disbaledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath location="系统日志-终端" />
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
              <RangePicker onChange={this.selectDate}></RangePicker>
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
            onChange={this.onTableChange}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
