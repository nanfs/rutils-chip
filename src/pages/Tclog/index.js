import React from 'react'
import { Button } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import { columns, apiMethod } from './chip/TableCfg'

export default class Tclog extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    })
  }

  render() {
    return (
      <TableWrap>
        <ToolBar>
          <BarLeft>
            <Button>删除</Button>
          </BarLeft>
          <BarRight>
            <Button>删除</Button>
          </BarRight>
        </ToolBar>
        <Tablex
          onRef={ref => {
            this.tablex = ref
          }}
          tableCfg={this.state.tableCfg}
        />
      </TableWrap>
    )
  }
}
