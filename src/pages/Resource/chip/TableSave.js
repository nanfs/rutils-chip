import React from 'react'
import { message } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'
import SelectSearch from '@/components/SelectSearch'
import { columnsSave, apiMethodSave } from './TableCfgSave'
import resourceApi from '@/services/resource'

export default class Resource extends React.Component {
  state = {
    tableCfgSave: createTableCfg({
      columns: columnsSave,
      apiMethod: apiMethodSave,
      expandedRowRender: false,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    })
  }

  render() {
    return (
      <React.Fragment>
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <SelectSearch
                options={[{ label: '名称', value: 'name' }]}
                onSearch={(searchKey, value) => {
                  console.log(searchKey, value)
                }}
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
