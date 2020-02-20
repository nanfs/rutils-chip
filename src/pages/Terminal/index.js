import React from 'react'
import { Button, message, notification, Menu, Dropdown, Icon } from 'antd'
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
import SendMessageDrawer from './chip/SendMessageDrawer'
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
    initValues: {},
    selectData: []
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

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
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

  sendMessage = () => {
    this.setState({ inner: '发送消息' }, this.sendMessageDrawer.drawer.show())
    this.currentDrawer = this.sendMessageDrawer
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
    const searchOptions = [
      { label: '名称', value: 'name' },
      { label: '位置', value: 'location' },
      { label: 'ip', value: 'ip' }
    ]
    const moreButton = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={this.deleteTerminal}
          disabled={!this.state.selection || !this.state.selection.length}
        >
          删除
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={this.detailTerminal}
          disabled={!this.state.selection || this.state.selection.length !== 1}
        >
          查看详情
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={this.suspendTerminal}
          disabled={!this.state.selection || !this.state.selection.length}
        >
          暂停
        </Menu.Item>
        <Menu.Item
          key="4"
          onClick={this.lockScreen}
          disabled={!this.state.selection || !this.state.selection.length}
        >
          锁屏
        </Menu.Item>
        <Menu.Item
          key="5"
          onClick={this.unlockScreen}
          disabled={!this.state.selection || !this.state.selection.length}
        >
          解锁
        </Menu.Item>
        <Menu.Item
          key="6"
          onClick={this.sendMessage}
          disabled={!this.state.selection || !this.state.selection.length}
        >
          发送消息
        </Menu.Item>
        <Menu.Item
          key="7"
          onClick={this.setSafepolicy}
          disabled={!this.state.selection || !this.state.selection.length}
        >
          设置外设策略
        </Menu.Item>
        <Menu.Item
          key="8"
          onClick={this.setAccesspolicy}
          disabled={!this.state.selection || !this.state.selection.length}
        >
          设置准入策略
        </Menu.Item>
      </Menu>
    )
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
                disabled={!this.state.selection || !this.state.selection.length}
              >
                分配用户
              </Button>
              <Button
                onClick={this.admitAccessTerminal}
                disabled={!this.state.selection || !this.state.selection.length}
              >
                允许接入
              </Button>
              {/* <Button
                onClick={this.onTerminal}
                disabled={
                  !this.state.selection || !this.state.selection.length
                }
              >
                开机
              </Button> */}
              <Button
                onClick={this.offTerminal}
                disabled={!this.state.selection || !this.state.selection.length}
              >
                关机
              </Button>
              <Button
                onClick={this.restartTerminal}
                disabled={!this.state.selection || !this.state.selection.length}
              >
                重启
              </Button>
              <Dropdown overlay={moreButton}>
                <Button>
                  更多操作 <Icon type="down" />
                </Button>
              </Dropdown>
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
            onSuccess={this.onSuccess}
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
            selection={this.state.selection}
          />
          <SendMessageDrawer
            onRef={ref => {
              this.sendMessageDrawer = ref
            }}
            onSuccess={this.onSuccess}
            selectData={this.state.selectData}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
