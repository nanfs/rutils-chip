import React from 'react'
import {
  Button,
  message,
  notification,
  Menu,
  Dropdown,
  Icon,
  Modal
} from 'antd'
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
import MyIcon from '@/components/MyIcon'

import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import SetSafePolicyDrawer from './chip/SetSafePolicyDrawer'
import SetAccessPolicyDrawer from './chip/SetAccessPolicyDrawer'
import SendMessageDrawer from './chip/SendMessageDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import terminalApi from '@/services/terminal'

import './index.scss'

const { confirm } = Modal

export default class Termina extends React.Component {
  options = {
    title: '操作',
    dataIndex: 'opration',
    className: 'opration',
    render: (text, record) => (
      <div>
        <MyIcon
          type="tc-connecting"
          title="允许接入"
          // disabled={record}
          onClick={this.admitAccessTerminal.bind(this, [record.sn])}
        />
        <MyIcon
          type="tc-down"
          title="关机"
          // disabled={record}
          onClick={this.sendOrder.bind(this, 'shutdown', [record.sn])}
        />
        {/* <MyIcon
          type="vm-rebootinprogress"
          title="重启"
          onClick={this.sendOrder.bind(this, 'restart', [record.sn])}
        />
        <MyIcon
          type="tc-imagelocked"
          title="锁屏"
          onClick={this.sendOrder.bind(this, 'lock', [record.sn])}
        /> */}
        <MyIcon
          type="tc-imagelocked"
          title="解锁"
          onClick={this.sendOrder.bind(this, 'unlock', [record.sn])}
        />
        {/* //TODO 缺少接口 */}
        <MyIcon
          type="order-setuser"
          title="分配用户"
          onClick={this.setUser.bind(this, [record.sn])}
        />
        <Icon
          type="message"
          title="发送消息"
          onClick={this.sendMessage.bind(this, [record.sn], [record])}
        />
        <Icon
          type="form"
          title="编辑"
          onClick={this.editTerminal.bind(this, record)}
        />
        <MyIcon
          type="order-info"
          title="详情"
          onClick={this.detailTerminal.bind(this, [record.sn])}
        />
      </div>
    )
  }

  columnsArr = [...columns, this.options]

  columnsArr = [...columns, this.options]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      rowKey: 'sn',
      paging: { size: 10 },
      pageSizeOptions: ['5', '10']
    }),
    innerPath: undefined,
    // initValues: {},
    selectData: [],
    selectSN: [],
    disbaledButton: {}
  }

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          // ...draft.tableCfg.searchs,
          status: draft.tableCfgSave.searchs.status,
          isReg: draft.tableCfgSave.searchs.isReg,
          ...searchs
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  editTerminal = (record = undefined) => {
    this.setState({ inner: '编辑终端' })
    // this.editDrawer.drawer.show()
    this.editDrawer.pop(record || this.tablex.getSelectData()[0])
    this.currentDrawer = this.editDrawer
  }

  setUser = sns => {
    this.setState({ inner: '分配用户' }, this.setUserDrawer.pop(sns))
    this.currentDrawer = this.setUserDrawer
  }

  setSafePolicy = () => {
    this.setState({ inner: '设置外设控制' })
    this.setSafePolicyDrawer.pop(this.tablex.getSelection())
    this.currentDrawer = this.setSafePolicyDrawer
  }

  setAccessPolicy = () => {
    this.setState({ inner: '设置准入控制' })
    this.setAccessPolicyDrawer.pop(this.tablex.getSelection())
    this.currentDrawer = this.setAccessPolicyDrawer
  }

  sendMessage = (sn = undefined, selectData = undefined) => {
    this.setState({ inner: '发送消息' })

    this.sendMessageDrawer.pop(
      sn || this.state.selectSN,
      selectData || this.state.selectData
    )
    // this.sendMessageDrawer.drawer.show()
    this.currentDrawer = this.sendMessageDrawer
  }

  detailTerminal = (sn = undefined) => {
    this.setState({ inner: '查看详情' })
    this.detailDrawer.pop(sn || this.state.selectSN)
    this.currentDrawer = this.detailDrawer
  }

  sendOrder = (order, sn = undefined) => {
    console.log('sendOrder', sn, order)
    const sns = sn || this.state.selectSN
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

  admitAccessTerminal = (sn = undefined) => {
    const sns = sn || this.state.selectSN
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

  deleteTerminal = (sn = undefined) => {
    const sns = sn || this.state.selectSN
    const self = this
    console.log(sns)
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        terminalApi
          .deleteTerminal({ sns })
          .then(res => {
            if (res.success) {
              notification.success({ message: '删除成功' })
              self.tablex.refresh(self.state.tableCfg)
            } else {
              message.error(res.message || '删除失败')
            }
          })
          .catch(errors => {
            console.log(errors)
          })
      },
      onCancel() {}
    })
  }

  onSelectChange = (selection, selectData) => {
    let disbaledButton = {}
    const selectSN = selectData.map(item => item.sn)
    if (selection.length !== 1) {
      disbaledButton = { ...disbaledButton, disabledEdit: true }
    }
    if (selection.length === 0) {
      disbaledButton = {
        ...disbaledButton,
        disabledDelete: true,
        disabledSetUser: true,
        disabledAdmitAccess: true,
        disabledShutdown: true
      }
    } else {
      const isAccessData = selectData.filter(item => item.isReg)
      if (isAccessData && isAccessData.length > 0) {
        disbaledButton = {
          ...disbaledButton,
          disabledAdmitAccess: true
        }
      }

      const isOffData = selectData.filter(item => !item.status)
      if (isOffData && isOffData.length > 0) {
        disbaledButton = {
          ...disbaledButton,
          disabledShutdown: true
        }
      }
    }

    this.setState({ disbaledButton, selection, selectData, selectSN })
  }

  onTableChange = (a, filter) => {
    const statusList = []
    filter.status &&
      filter.status.forEach(function(v, i) {
        statusList.push(...v)
      })
    const isRegList = []
    filter.isReg &&
      filter.isReg.forEach(function(v, i) {
        isRegList.push(...v)
      })
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          status: statusList,
          isReg: isRegList
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  render() {
    const searchOptions = [
      { label: '名称', value: 'name' },
      { label: '位置', value: 'location' },
      { label: 'IP', value: 'ip' }
    ]
    const { disbaledButton } = this.state
    const moreButton = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={() => this.deleteTerminal()}
          disabled={disbaledButton.disabledDelete}
        >
          删除
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => this.detailTerminal()}
          disabled={disbaledButton.disabledEdit}
        >
          查看详情
        </Menu.Item>
        {/* <Menu.Item
          key="3"
          onClick={() => this.sendOrder('suspend')}
          disabled={disbaledButton.disabledDelete}
        >
          暂停
        </Menu.Item> */}
        <Menu.Item
          key="4"
          onClick={() => this.sendOrder('lock')}
          disabled={true}
        >
          锁屏
        </Menu.Item>
        <Menu.Item
          key="5"
          onClick={() => this.sendOrder('unlock')}
          disabled={true}
        >
          解锁
        </Menu.Item>
        <Menu.Item
          key="6"
          onClick={() => this.sendMessage()}
          disabled={disbaledButton.disabledDelete}
        >
          发送消息
        </Menu.Item>
        <Menu.Item
          key="7"
          onClick={() => this.setSafePolicy()}
          disabled={disbaledButton.disabledDelete}
        >
          设置外设控制
        </Menu.Item>
        <Menu.Item
          key="8"
          onClick={() => this.setAccessPolicy()}
          disabled={disbaledButton.disabledDelete}
        >
          设置准入控制
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
              {/* <Button
                onClick={() => this.editTerminal()}
                disabled={disbaledButton.disabledEdit}
              >
                编辑
              </Button> */}

              {/* <Button
                onClick={this.onTerminal}
                disabled={
                  !this.state.selection || !this.state.selection.length
                }
              >
                开机
              </Button> */}
              <Button
                onClick={() => this.sendOrder('shutdown')}
                disabled={disbaledButton.disabledShutdown}
              >
                关机
              </Button>
              <Button
                onClick={() => this.sendOrder('restart')}
                disabled={disbaledButton.disabledShutdown}
              >
                重启
              </Button>
              <Button
                onClick={() => this.setUser(this.tablex.getSelection())}
                disabled={disbaledButton.disabledSetUser}
              >
                分配用户
              </Button>
              <Button
                onClick={() => this.admitAccessTerminal()}
                disabled={disbaledButton.disabledAdmitAccess}
              >
                允许接入
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
            onChange={this.onTableChange}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
          <DetailDrawer
            onRef={ref => {
              this.detailDrawer = ref
            }}
            onClose={this.onBack}
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
            onClose={this.onBack}
            onSuccess={this.onSuccess}
            selection={this.state.selection}
          />
          <SetAccessPolicyDrawer
            onRef={ref => {
              this.setAccessPolicyDrawer = ref
            }}
            onClose={this.onBack}
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
