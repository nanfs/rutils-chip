import React from 'react'
import { Button, message, notification } from 'antd'
import produce from 'immer'

import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import InnerPath from '@/components/InnerPath'
import SelectSearch from '@/components/SelectSearch'

import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import terminalApi from '@/services/terminal'

import './index.scss'

export default class Termina extends React.Component {
  options = {
    title: '操作',
    dataIndex: 'opration',
    className: 'opration',
    render: (text, record) => (
      <div>
        <Button
          onClick={this.sendOrder.bind(this, record.id, 'turnOn')}
          icon="user"
        />
        <Button
          onClick={this.sendOrder.bind(this, record.id, 'turnOff')}
          icon="user"
        />
        <Button onClick={this.detailVm}>详情</Button>
      </div>
    )
  }

  columnsArr = [...columns, this.options]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    }),
    innerPath: undefined,
    initValues: {}
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

  sendOrder = (id, order) => {
    console.log('sendOrder', id, order)
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  editTerminal = () => {
    this.setState({ inner: '编辑终端', initValues: this.state.selectData[0] })
    this.editDrawer.drawer.show()
    this.currentDrawer = this.editDrawer
  }

  setUser = () => {
    this.setState({ inner: '分配用户' }, this.setUserDrawer.drawer.show())
    this.currentDrawer = this.setUserDrawer
  }

  detailTerminal = () => {
    const ids = this.tablex.getSelection()
    terminalApi
      .terminalsdetail({ ids })
      .then(res => {
        if (res.success) {
          this.setState({ inner: '查看详情', initValues: res.data })
          terminalApi.terminalsusagedetail({ ids }).then(result => {
            if (result.success) {
              this.setState({ initChartValue: result.data.list })
              this.detailDrawer.drawer.show()
              this.currentDrawer = this.detailDrawer
            } else {
              message.error(res.message || '查询失败')
            }
          })
        } else {
          message.error(res.message || '查询失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  onTerminal = () => {
    const ids = this.tablex.getSelection()
    terminalApi
      .onTerminal({ ids })
      .then(res => {
        if (res.success) {
          notification.success({ message: '开机成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '开机失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  offTerminal = () => {
    const ids = this.tablex.getSelection()
    terminalApi
      .onTerminal({ ids })
      .then(res => {
        if (res.success) {
          notification.success({ message: '关机成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '关机失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  restartTerminal = () => {
    const ids = this.tablex.getSelection()
    terminalApi
      .onTerminal({ ids })
      .then(res => {
        if (res.success) {
          notification.success({ message: '重启成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '重启失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  admitAccessTerminal = () => {
    const ids = this.tablex.getSelection()
    terminalApi
      .onTerminal({ ids })
      .then(res => {
        if (res.success) {
          notification.success({ message: '接入成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '接入失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  render() {
    const searchOptions = [{ label: '名称', value: 'name' }]
    return (
      <React.Fragment>
        <InnerPath
          location="终端管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                onClick={this.editTerminal}
                disabled={
                  !this.state.selection || this.state.selection.length !== 1
                }
              >
                编辑
              </Button>
              <Button
                onClick={this.setUser}
                disabled={
                  !this.state.selection || this.state.selection.length !== 1
                }
              >
                分配用户
              </Button>
              <Button
                onClick={this.admitAccessTerminal}
                disabled={
                  !this.state.selection || this.state.selection.length === 0
                }
              >
                允许接入
              </Button>
              {/* <Button
                onClick={this.onTerminal}
                disabled={
                  !this.state.selection || this.state.selection.length === 0
                }
              >
                开机
              </Button> */}
              <Button
                onClick={this.offTerminal}
                disabled={
                  !this.state.selection || this.state.selection.length === 0
                }
              >
                关机
              </Button>
              <Button
                onClick={this.restartTerminal}
                disabled={
                  !this.state.selection || this.state.selection.length === 0
                }
              >
                重启
              </Button>
              <Button
                onClick={this.detailTerminal}
                disabled={
                  !this.state.selection || this.state.selection.length !== 1
                }
              >
                查看详情
              </Button>
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
            className="no-select-bg"
            tableCfg={this.state.tableCfg}
            onSelectChange={(selection, selectData) => {
              this.setState({ selection, selectData })
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
            initChartValue={this.state.initChartValue}
          />
          <SetUserDrawer
            onRef={ref => {
              this.setUserDrawer = ref
            }}
            onSuccess={this.onSuccess}
            selection={this.state.tableCfg.selection}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
