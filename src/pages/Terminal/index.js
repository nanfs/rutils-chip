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

import { Tablex, InnerPath, SelectSearch } from '@/components'

import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import SetSafePolicyDrawer from './chip/SetSafePolicyDrawer'
import SetAccessPolicyDrawer from './chip/SetAccessPolicyDrawer'
import SendMessageDrawer from './chip/SendMessageDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import terminalApi from '@/services/terminal'
import { checkAuth } from '@/utils/checkPermissions'
import { Auth } from '@/components/Authorized'
import './index.less'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
export default class Terminal extends React.Component {
  options = {
    title: '操作',
    dataIndex: 'opration',
    width: 130,
    render: (text, record) => {
      const moreAction = (
        <Menu>
          <Menu.Item
            key="8"
            hidden={!checkAuth('admin')}
            onClick={() => {
              this.deleteTerminal(record.sn, '确定删除该条数据?')
            }}
          >
            删除
          </Menu.Item>
          <Menu.Item
            key="2"
            hidden={!checkAuth('admin')}
            onClick={this.sendOrder.bind(this, 'shutdown', [record.sn])}
            disabled={!record.status}
          >
            关机
          </Menu.Item>
          <Menu.Item
            key="3"
            hidden={!checkAuth('admin')}
            onClick={this.sendOrder.bind(this, 'restart', [record.sn])}
            disabled={!record.status}
          >
            重启
          </Menu.Item>
          <Menu.Item
            key="4"
            hidden={!checkAuth('admin')}
            onClick={this.sendOrder.bind(this, 'lock', [record.sn])}
            disabled={!record.status}
          >
            锁定
          </Menu.Item>
          <Menu.Item
            key="5"
            hidden={!checkAuth('admin')}
            onClick={this.sendOrder.bind(this, 'unlock', [record.sn])}
            disabled={!record.status}
          >
            解锁
          </Menu.Item>
          {/* <Menu.Item
            key="9"
            disabled={!record.status}
            onClick={this.sendOrder.bind(this, 'logout', [record.sn])}
          >
            登出
          </Menu.Item> */}
          <Menu.Item
            key="6"
            hidden={!checkAuth('security')}
            onClick={this.setUser.bind(this, [record.sn])}
          >
            分配用户
          </Menu.Item>
          <Menu.Item
            key="1"
            hidden={!checkAuth('admin')}
            onClick={this.admitAccessTerminal.bind(this, [record.sn])}
            disabled={record.isReg}
          >
            允许接入
          </Menu.Item>
          <Menu.Item
            key="7"
            hidden={!checkAuth('admin')}
            onClick={this.sendMessage.bind(this, [record.sn], [record])}
            disabled={!record.isReg}
          >
            发送消息
          </Menu.Item>
          <Menu.Item
            key="10"
            hidden={!checkAuth('security')}
            onClick={() => {
              this.setState({ inner: '设置外设控制' })
              this.setSafePolicyDrawer.pop([record.sn])
              this.currentDrawer = this.setSafePolicyDrawer
            }}
          >
            设置外设控制
          </Menu.Item>
          <Menu.Item
            key="11"
            hidden={!checkAuth('security')}
            onClick={() => {
              this.setState({ inner: '设置准入控制' })
              this.setAccessPolicyDrawer.pop([record.sn])
              this.currentDrawer = this.setAccessPolicyDrawer
            }}
          >
            设置准入控制
          </Menu.Item>
        </Menu>
      )
      return (
        <span className="opration-btn">
          <a
            hidden={!checkAuth('admin')}
            onClick={() => this.editTerminal(record.name, record)}
          >
            编辑
          </a>

          <Dropdown overlay={moreAction} placement="bottomRight">
            <a>
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </span>
      )
    }
  }

  tcName = {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'name',

    ellipsis: true,
    render: (text, record) => {
      return (
        <a
          className="detail-link"
          onClick={() => this.detailTerminal(record.name, record.sn)}
        >
          {record.name}
        </a>
      )
    }
  }

  columnsArr = [this.tcName, ...columns, this.options]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      rowKey: 'sn',
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined,
    // initValues: {},
    selectData: [],
    selectSN: [],
    disabledButton: {}
  }

  /**
   * @memberof Terminal
   * @description 根据选定数据判断按钮状态
   * @author linghu
   */
  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    const selectSN = selectData.map(item => item.sn.split(' ')[0])
    if (selection.length !== 1) {
      disabledButton = { ...disabledButton, disabledEdit: true }
    }
    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true,
        disabledSetUser: true,
        disabledAdmitAccess: true,
        disabledShutdown: true,
        disabledSendMessage: true,
        disabledForbidAccess: true
      }
    } else {
      selectData.forEach(item => {
        if (item.isReg) {
          disabledButton = {
            ...disabledButton,
            disabledAdmitAccess: true
          }
        }
        if (!item.isReg) {
          disabledButton = {
            ...disabledButton,
            disabledSendMessage: true,
            disabledForbidAccess: true
          }
        }
        if (!item.status) {
          disabledButton = {
            ...disabledButton,
            disabledShutdown: true
          }
        }
      })
    }

    this.setState({ disabledButton, selection, selectData, selectSN })
  }

  /**
   * 当搜索条件下来处理
   *
   * @memberof Vmlog
   */
  onSearchSelectChange = oldKey => {
    const searchs = { ...this.state.tableCfg.searchs }
    delete searchs[oldKey]
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...searchs
        }
      })
    )
  }

  /**
   * @memberof Terminal
   * @description 表格onChange的回调
   * @author linghu
   */
  onTableChange = (a, filter) => {
    const statusList = []
    filter.status &&
      filter.status.forEach(function(v) {
        statusList.push(...v)
      })
    const isRegList = []
    filter.isReg &&
      filter.isReg.forEach(function(v) {
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
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  /**
   * @memberof Terminal
   * @description 表格搜索
   */
  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          // ...draft.tableCfg.searchs,
          status: draft.tableCfg.searchs.status,
          isReg: draft.tableCfg.searchs.isReg,
          ...searchs
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  /**
   * @memberof Terminal
   * @description 新增、编辑成功后回调
   * @author linghu
   */
  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
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

  detailTerminal = (name, sn) => {
    this.setState({ inner: name })
    this.infoDrawer.pop(sn)
    this.currentDrawer = this.infoDrawer
  }

  /**
   * @memberof Terminal
   * @param order 具体指令：lock unclock logout
   * @param sn 终端sn
   * @description 向所选终端下发指令
   * @author linghu
   */
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

  /**
   * @memberof Terminal
   * @param sn 终端sn
   * @description 接入所选终端
   * @author linghu
   */
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

  /**
   * @memberof Terminal
   * @param sn 终端sn
   * @description 断开所选已接入终端
   * @author linghu
   */
  forbidAccessTerminal = (sn = undefined) => {
    const sns = sn || this.state.selectSN
    terminalApi
      .forbidAccessTerminal({ sns })
      .then(res => {
        if (res.success) {
          notification.success({ message: '断开接入成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '断开接入失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  editTerminal = (name, data) => {
    this.setState({ inner: name }, this.editDrawer.pop(data))
    this.currentDrawer = this.editDrawer
  }

  deleteTerminal = (sn, title = '确定删除所选数据?') => {
    const sns = Array.isArray(sn) ? [...sn] : [sn]
    const self = this
    confirm({
      title,
      onOk() {
        return new Promise(resolve => {
          terminalApi
            .deleteTerminal({ sns })
            .then(res => {
              if (res.success) {
                notification.success({ message: '删除成功' })
                self.tablex.refresh(self.state.tableCfg)
              } else {
                message.error(res.message || '删除失败')
              }
              resolve()
            })
            .catch(error => {
              message.error(error.message || error)
              error.type === 'timeout' &&
                self.tablex.refresh(self.state.tableCfg)
              resolve()
              console.log(error)
            })
        })
      },
      onCancel() {}
    })
  }

  render() {
    const searchOptions = [
      { label: '名称', value: 'name' },
      { label: '位置', value: 'location' },
      { label: 'IP', value: 'ip' }
    ]
    const { disabledButton } = this.state
    const moreButton = (
      <Menu>
        <Menu.Item
          key="delete"
          hidden={!checkAuth('admin')}
          onClick={() => this.deleteTerminal(this.state.selectSN)}
          disabled={disabledButton.disabledDelete}
        >
          删除
        </Menu.Item>
        <Menu.Item
          key="restart"
          hidden={!checkAuth('admin')}
          onClick={() => this.sendOrder('restart')}
          disabled={disabledButton.disabledShutdown}
        >
          重启
        </Menu.Item>
        <Menu.Item
          key="lock"
          hidden={!checkAuth('admin')}
          onClick={() => this.sendOrder('lock')}
          disabled={disabledButton.disabledShutdown}
        >
          锁定
        </Menu.Item>
        <Menu.Item
          key="unlock"
          hidden={!checkAuth('admin')}
          onClick={() => this.sendOrder('unlock')}
          disabled={disabledButton.disabledShutdown}
        >
          解锁
        </Menu.Item>
        <Menu.Item
          hidden={!checkAuth('admin')}
          key="sendMessage"
          onClick={() => this.sendMessage()}
          disabled={disabledButton.disabledSendMessage}
        >
          发送消息
        </Menu.Item>
        <Menu.Item
          key="setSafePolicy"
          hidden={!checkAuth('security')}
          onClick={() => this.setSafePolicy()}
          disabled={disabledButton.disabledDelete}
        >
          设置外设控制
        </Menu.Item>
        <Menu.Item
          hidden={!checkAuth('security')}
          key="setAccessPolicy"
          onClick={() => this.setAccessPolicy()}
          disabled={disabledButton.disabledDelete}
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
              <Button
                onClick={() => this.sendOrder('shutdown')}
                disabled={disabledButton.disabledShutdown}
                hidden={!checkAuth('admin')}
              >
                关机
              </Button>
              <Button
                hidden={!checkAuth('security')}
                onClick={() => this.setUser(this.tablex.getSelection())}
                disabled={disabledButton.disabledSetUser}
              >
                分配用户
              </Button>

              <Button
                onClick={() => this.admitAccessTerminal()}
                disabled={disabledButton.disabledAdmitAccess}
                hidden={!checkAuth('admin')}
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
                onSelectChange={this.onSearchSelectChange}
                onSearch={this.search}
              ></SelectSearch>
            </BarRight>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            autoReplace={true}
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
              this.infoDrawer = ref
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
