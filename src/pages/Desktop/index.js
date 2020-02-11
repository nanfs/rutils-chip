import React from 'react'
import { Button, message } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import InnerPath from '@/components/InnerPath'
import SelectSearch from '@/components/SelectSearch'
import produce from 'immer'

import { columns, apiMethod } from './chip/TableCfg'
import './index.scss'

export default class Desktop extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    }),
    innerPath: undefined,
    initValues: {}
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  componentDidMount() {
    this.createVm()
  }

  createVm = () => {
    this.setState({ inner: '新建桌面' }, this.addDrawer.drawer.show())
    this.currentDrawer = this.addDrawer
  }

  editVm = () => {
    this.setState(
      { inner: '编辑桌面', initValues: this.state.selectData[0] },
      this.editDrawer.drawer.show()
    )
    this.currentDrawer = this.editDrawer
  }

  detailTerminal = () => {
    let selectTem = {}
    if (this.tablex.getSelection().length === 1) {
      this.tablex.getData().forEach(item => {
        if (item.id === this.tablex.getSelection()[0]) {
          selectTem = item
        }
      })
      this.setState(
        { inner: '编辑模板', initValues: selectTem },
        this.detailDrawer.drawer.show()
      )
      this.currentDrawer = this.detailDrawer
    } else {
      message.warning('请选择一条数据进行编辑！')
    }
  }

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...searchs
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  render() {
    const searchOptions = [{ label: '名称', value: 'name' }]
    return (
      <React.Fragment>
        <InnerPath
          location="桌面管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.createVm}>创建桌面</Button>
              <Button
                disabled={
                  !this.state.selection || this.state.selection.length !== 1
                }
                onClick={this.editVm}
              >
                编辑桌面
              </Button>
              <Button onClick={this.setUsers}>分配用户</Button>
              <Button onClick={this.turnOn}>开机</Button>
              <Button onClick={this.turnOff}>关机</Button>
            </BarLeft>
            <BarRight>
              <SelectSearch
                options={searchOptions}
                onSearch={this.search}
              ></SelectSearch>
            </BarRight>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
            onSelectChange={(selection, selectData) => {
              this.setState({ selection, selectData })
            }}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            initValues={this.state.initValues}
          />
          <DetailDrawer
            onRef={ref => {
              this.detailDrawer = ref
            }}
            initValues={this.state.initValues}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
