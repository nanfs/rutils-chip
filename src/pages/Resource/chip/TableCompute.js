import React from 'react'
import { message } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'
import SelectSearch from '@/components/SelectSearch'
import { columnsCompute, apiMethodCompute } from './TableCfgCompute'
import resourceApi from '@/services/resource'

export default class Resource extends React.Component {
  state = {
    tableCfgCompute: createTableCfg({
      columns: columnsCompute,
      apiMethod: apiMethodCompute,
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
              this.tablexCompute = ref
            }}
            tableCfg={this.state.tableCfgCompute}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
