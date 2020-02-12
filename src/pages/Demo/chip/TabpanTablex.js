import React from 'react'
import { Button } from 'antd'
import Tablex, { createTableCfg } from '@/components/Tablex'
import { columns, apiMethod, expandedRowRender } from './TestTable'
import produce from 'immer'

export default class TabpanTablex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableCfg: createTableCfg({
        columns,
        apiMethod,
        paging: { size: 5 },
        expandedRowRender,
        pageSizeOptions: ['5', '10']
      })
    }
  }

  render() {
    return (
      <div className="table-wrapper">
        <div className="table-tool">
          <div className="button-group left">
            <Button
              type="primary"
              icon="add"
              className="mr10"
              onClick={() => {
                this.setState(
                  produce(draft => {
                    draft.tableCfg.selection = []
                  }),
                  () => this.tablex.refresh(this.state.tableCfg)
                )
              }}
            >
              刷新
            </Button>
            <Button
              type="primary"
              icon="add"
              className="mr10"
              onClick={() => {
                this.tablex.replace(this.state.tableCfg)
              }}
            >
              不显示刷新
            </Button>
            <Button
              type="primary"
              icon="add"
              className="mr10"
              onClick={() => {
                console.log(this.tablex.getSelection())
              }}
            >
              打印选择
            </Button>
          </div>
        </div>
        <Tablex
          onRef={ref => {
            this.tablex = ref
          }}
          tableCfg={this.state.tableCfg}
        />
      </div>
    )
  }
}
