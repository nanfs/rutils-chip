import React from 'react'
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
      rowKey: record => `${record.id}&${record.storagePoolName}`,
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
        draft.tableCfgSave.searchs = {
          // ...draft.tableCfgSave.searchs,
          status: draft.tableCfgSave.searchs.status,
          ...searchs
        }
      }),
      () => this.tablexSave.refresh(this.state.tableCfgSave)
    )
  }

  onTableChange = (a, filter) => {
    const statusList = []
    filter.status.forEach(function(v, i) {
      statusList.push(...v)
    })
    this.setState(
      produce(draft => {
        draft.tableCfgSave.searchs = {
          ...draft.tableCfgSave.searchs,
          status: statusList
        }
      }),
      () => this.tablexSave.refresh(this.state.tableCfgSave)
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
                options={[
                  { label: '名称', value: 'name' },
                  { label: '描述', value: 'description' }
                ]}
                onSearch={this.search}
              ></SelectSearch>
            </BarLeft>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablexSave = ref
            }}
            tableCfg={this.state.tableCfgSave}
            onChange={this.onTableChange}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
