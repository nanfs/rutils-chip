import React from 'react'
import { Tablex, SelectSearch, TitleInfo } from '@/components'
import { columnsSave, apiMethodSave } from './TableCfgSave'
import produce from 'immer'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
export default class Resource extends React.Component {
  state = {
    tableCfgSave: createTableCfg({
      columns: columnsSave,
      rowKey: record => `${record.id}&${record.storagePoolName}`,
      apiMethod: apiMethodSave,
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
                  // { label: '数据中心', value: 'storagePoolName' }
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
