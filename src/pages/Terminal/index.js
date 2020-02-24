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
import SetSafePolicyDrawer from './chip/SetSafePolicyDrawer'
import SetAccessPolicyDrawer from './chip/SetAccessPolicyDrawer'
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
          onClick={this.sendOrder.bind(this, 'turnOn', record.id)}
          icon="user"
        />
        <Button
          onClick={this.sendOrder.bind(this, 'turnOff', record.id)}
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
    selectData: [],
    disbaledButton: {}
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
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
    this.tablex.refresh(this.state.tableCfg)
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
    this.setState({ inner: '分配用户' })
    this.setUserDrawer.drawer.show()
    this.currentDrawer = this.setUserDrawer
  }

  sendMessage = () => {
    this.setState({ inner: '发送消息' })
    this.sendMessageDrawer.drawer.show()
    this.currentDrawer = this.sendMessageDrawer
  }

  detailTerminal = () => {
    const ids = this.tablex.getSelection()
    terminalApi
      .terminalsdetail(ids[0])
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

  sendOrder = (order, id = undefined) => {
    console.log('sendOrder', id, order)
    const sns = this.tablex.getSelection()
    terminalApi
      .directiveTerminal({ sns, command: order })
      .then(res => {
        if (res.success) {
          notification.success({ message: '操作成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '操作失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  admitAccessTerminal = () => {
    const sns = this.tablex.getSelection()
    terminalApi
      .admitAccessTerminal({ sns })
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

  onSelectChange = (selection, selectData) => {
    let disbaledButton = {}
    if (selection.length !== 1) {
      disbaledButton = { ...disbaledButton, disabledEdit: true }
    }
    if (selection.length === 0) {
      disbaledButton = {
        ...disbaledButton,
        disabledDelete: true,
        disabledSetUser: true
      }
    }
    this.setState({ disbaledButton, selection, selectData })
  }

  render() {
    const searchOptions = [
      { label: '名称', value: 'name' },
      { label: '位置', value: 'location' },
      { label: 'ip', value: 'ip' }
    ]
    const { disbaledButton } = this.state
    const moreButton = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={this.deleteTerminal}
          disabled={disbaledButton.disabledDelete}
        >
          删除
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={this.detailTerminal}
          disabled={disbaledButton.disabledEdit}
        >
          查看详情
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={this.sendOrder.bind(this, 'suspend')}
          disabled={disbaledButton.disabledDelete}
        >
          暂停
        </Menu.Item>
        <Menu.Item
          key="4"
          onClick={this.sendOrder.bind(this, 'lock')}
          disabled={disbaledButton.disabledDelete}
        >
          锁屏
        </Menu.Item>
        <Menu.Item
          key="5"
          onClick={this.sendOrder.bind(this, 'unlock')}
          disabled={disbaledButton.disabledDelete}
        >
          解锁
        </Menu.Item>
        <Menu.Item
          key="6"
          onClick={this.sendMessage}
          disabled={disbaledButton.disabledDelete}
        >
          发送消息
        </Menu.Item>
        <Menu.Item
          key="7"
          onClick={this.setSafePolicy}
          disabled={disbaledButton.disabledDelete}
        >
          设置外设策略
        </Menu.Item>
        <Menu.Item
          key="8"
          onClick={this.setAccessPolicy}
          disabled={disbaledButton.disabledDelete}
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
                disabled={disbaledButton.disabledEdit}
              >
                编辑
              </Button>
              <Button
                onClick={this.setUser}
                disabled={disbaledButton.disabledEdit}
              >
                分配用户
              </Button>
              <Button
                onClick={this.admitAccessTerminal}
                disabled={disbaledButton.disabledSetUser}
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
                onClick={this.sendOrder.bind(this, 'turnOff')}
                disabled={disbaledButton.disabledEdit}
              >
                关机
              </Button>
              <Button
                onClick={this.sendOrder.bind(this, 'restart')}
                disabled={disbaledButton.disabledEdit}
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
            onSelectChange={this.onSelectChange}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            initValues={this.state.initValues}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
          <DetailDrawer
            onRef={ref => {
              this.detailDrawer = ref
            }}
            onClose={this.onBack}
            initValues={this.state.initValues}
            initChartValue={this.state.initChartValue}
          />
          <SetUserDrawer
            onRef={ref => {
              this.setUserDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
            selection={this.state.selection}
          />
          <SetSafePolicyDrawer
            onRef={ref => {
              this.setSafePolicyDrawer = ref
            }}
            onSuccess={this.onSuccess}
            selection={this.state.selection}
          />
          <SetAccessPolicyDrawer
            onRef={ref => {
              this.setAccessPolicyDrawer = ref
            }}
            onSuccess={this.onSuccess}
            selection={this.state.selection}
          />
          <SendMessageDrawer
            onRef={ref => {
              this.sendMessageDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
            selectData={this.state.selectData}
            selection={this.state.selection}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
