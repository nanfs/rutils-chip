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

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfgCompute.searchs = {
          // ...draft.tableCfgCompute.searchs,
          status: draft.tableCfgCompute.searchs.status,
          ...searchs
        }
      }),
      () => this.tablexCompute.refresh(this.state.tableCfgCompute)
    )
  }

  onTableChange = (a, filter) => {
    const statusList = []
    filter.status &&
      filter.status.forEach(function(v, i) {
        statusList.push(...v)
      })
    this.setState(
      produce(draft => {
        draft.tableCfgCompute.searchs = {
          ...draft.tableCfgCompute.searchs,
          status: statusList
        }
      }),
      () => this.tablexCompute.refresh(this.state.tableCfgCompute)
    )
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ marginBottom: '26px' }}>
          <TableWrap>
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
          </TableWrap>
        </div>
      </React.Fragment>
    )
  }
}
