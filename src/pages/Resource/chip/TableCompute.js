import React from 'react'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'
import SelectSearch from '@/components/SelectSearch'
import { columnsCompute, apiMethodCompute } from './TableCfgCompute'
import TitleInfo from '@/components/Title/TitleInfo'
import produce from 'immer'

export default class Resource extends React.Component {
  state = {
    tableCfgCompute: createTableCfg({
      columns: columnsCompute,
      apiMethod: apiMethodCompute,
      expandedRowRender: false,
      hasRowSelection: false,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    })
  }

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfgCompute.searchs = {
          // ...draft.tableCfgCompute.searchs,
          ...searchs
        }
      }),
      () => this.tablexCompute.refresh(this.state.tableCfgCompute)
    )
  }

  onTableChange = (a, filter) => {
    this.setState(
      produce(draft => {
        draft.tableCfgCompute.searchs = {
          ...draft.tableCfgCompute.searchs,
          ...filter
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
