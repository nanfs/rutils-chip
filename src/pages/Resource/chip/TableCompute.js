import React from 'react'
import { Tablex, SelectSearch, TitleInfo } from '@/components'
import { columnsCompute, apiMethodCompute } from './TableCfgCompute'
import produce from 'immer'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
export default class Resource extends React.Component {
  state = {
    tableCfgCompute: createTableCfg({
      columns: columnsCompute,
      apiMethod: apiMethodCompute,
      expandedRowRender: false,
      hasRowSelection: false,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10', '20', '50']
    })
  }

  /**
   * @param key 搜索字段
   * @param value 搜索值
   * 支持按名称、IP、描述来搜索
   */
  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfgCompute.searchs = {
          status: draft.tableCfgCompute.searchs.status,
          ...searchs
        }
      }),
      () => this.tablexCompute.search(this.state.tableCfgCompute)
    )
  }

  /**
   * @param filter 筛选对象
   * 支持按状态来筛选
   */
  onTableChange = (a, filter) => {
    const statusList = []
    filter.status &&
      filter.status.forEach(function(v) {
        statusList.push(...v)
      })
    this.setState(
      produce(draft => {
        draft.tableCfgCompute.searchs = {
          ...draft.tableCfgCompute.searchs,
          status: statusList
        }
      }),
      () => this.tablexCompute.search(this.state.tableCfgCompute)
    )
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ marginBottom: '26px' }}>
          <TitleInfo slot="计算资源" />
          <ToolBar>
            <BarLeft>
              <SelectSearch
                options={[
                  { label: '名称', value: 'name' },
                  { label: 'IP', value: 'ip' },
                  { label: '描述', value: 'description' }
                ]}
                onSearch={this.search}
              ></SelectSearch>
            </BarLeft>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablexCompute = ref
            }}
            tableCfg={this.state.tableCfgCompute}
            onChange={this.onTableChange}
          />
        </div>
      </React.Fragment>
    )
  }
}
