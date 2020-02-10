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
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    })
  }

  selectDate = rangeDate => {
    const [startDate, endDate] = rangeDate
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
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

  deleteLogs = () => {
    const ids = this.tablex.getSelection()
    tclogsApi
      .delete({ ids })
      .then(res => {
        if (res.success) {
          notification.success({ title: '删除成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '删除失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  render() {
    const searchOptions = [{ label: '名称', value: 'name' }]
    return (
      <React.Fragment>
        <InnerPath location="系统日志-终端" />
        <TableWrap>
          <ToolBar>
            <BarLeft span={10}>
              <Button onClick={this.deleteLogs}>删除</Button>
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
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
