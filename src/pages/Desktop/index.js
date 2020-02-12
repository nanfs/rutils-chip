import React from 'react'
import { Button } from 'antd'
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
import SetUserDrawer from './chip/SetUserDrawer'
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

  onSelectChange = (selection, selectData) => {
    this.setState({
      tableCfg: { ...this.state.tableCfg, selection, selectData }
    })
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

  detailVm = () => {
    this.setState(
      { inner: '编辑桌面', data: this.state.selectData[0] },
      this.detailDrawer.drawer.show()
    )
    this.currentDrawer = this.detailDrawer
  }

  setUser = () => {
    this.setState({ inner: '分配用户' }, this.setUserDrawer.drawer.show())
    this.currentDrawer = this.setUserDrawer
  }

  componentDidMount() {
    this.setUser()
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
                  !this.state.tableCfg.selection ||
                  this.state.tableCfg.selection.length !== 1
                }
                onClick={this.editVm}
              >
                编辑桌面
              </Button>
              <Button
                disabled={
                  !this.state.tableCfg.selection ||
                  this.state.tableCfg.selection.length !== 1
                }
                onClick={this.detailVm}
              >
                详情
              </Button>
              <Button onClick={this.setUser}>分配用户</Button>
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
            onSelectChange={this.onSelectChange}
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
          <SetUserDrawer
            onRef={ref => {
              this.setUserDrawer = ref
            }}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
