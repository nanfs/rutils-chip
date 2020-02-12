import React from 'react'
import { message } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'
import SelectSearch from '@/components/SelectSearch'
import TitleInfo from '@/components/Title/TitleInfo'
import { columnsSave, apiMethodSave } from './TableCfgSave'
import produce from 'immer'

export default class Resource extends React.Component {
  state = {
    tableCfgSave: createTableCfg({
      columns: columnsSave,
      apiMethod: apiMethodSave,
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
          ...draft.tableCfgCompute.searchs,
          ...searchs
        }
      }),
      () => this.tablexCompute.refresh(this.state.tableCfgCompute)
    )
  }

  render() {
    return (
      <React.Fragment>
        <TableWrap>
          <TitleInfo slot="存储资源" />
          <ToolBar>
            <BarLeft>
              <SelectSearch
                options={[{ label: '名称', value: 'name' }]}
                onSearch={this.search}
              ></SelectSearch>
            </BarLeft>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablexSave = ref
            }}
            tableCfg={this.state.tableCfgSave}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
