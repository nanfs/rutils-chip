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

import { Tablex, InnerPath, SelectSearch, Reminder } from '@/components'
import terminalApi from '@/services/terminal'
import { wrapResponse, handleTcMessage } from '@/utils/tool'

import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import SetSafePolicyDrawer from './chip/SetSafePolicyDrawer'
import SetAccessPolicyDrawer from './chip/SetAccessPolicyDrawer'
import SendMessageDrawer from './chip/SendMessageDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import './index.less'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
export default class Terminal extends React.Component {
  options = {
    title: '操作',
    dataIndex: 'opration',
    className: 'opration-btn',
    width: 130,
    render: (text, record) => {
      const moreAction = (
        <Menu>
          <Menu.Item
            key="8"
            onClick={() => {
              this.deleteTerminal(record.sn, '确定删除该条数据?')
            }}
          >
            删除
          </Menu.Item>
          <Menu.Item
            key="2"
            onClick={this.sendOrder.bind(this, 'shutdown', [record.sn])}
            disabled={!record.status}
          >
            关机
          </Menu.Item>
          <Menu.Item
            key="3"
            onClick={this.sendOrder.bind(this, 'restart', [record.sn])}
            disabled={!record.status}
          >
            重启
          </Menu.Item>
          <Menu.Item
            key="4"
            onClick={this.sendOrder.bind(this, 'lock', [record.sn])}
            disabled={!record.status}
          >
            锁定
          </Menu.Item>
          <Menu.Item
            key="5"
            onClick={this.sendOrder.bind(this, 'unlock', [record.sn])}
            disabled={!record.status}
          >
            解锁
          </Menu.Item>
          <Menu.Item key="6" onClick={this.setUser.bind(this, [record.sn])}>
            分配用户
          </Menu.Item>
          <Menu.Item
            key="1"
            onClick={this.admitAccessTerminal.bind(this, [record.sn])}
            disabled={record.isReg}
          >
            允许接入
          </Menu.Item>
          <Menu.Item
            key="7"
            onClick={this.sendMessage.bind(this, [record.sn], [record])}
            disabled={!record.isReg}
          >
            发送消息
          </Menu.Item>
          <Menu.Item
            key="10"
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
        <span>
          <a onClick={() => this.editTerminal(record.name, record)}>编辑</a>

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
    width: 100,
    resize: true,
    render: (text, record) => {
      return (
        <a
          className="detail-link"
          onClick={() => this.detailTerminal(record.name, record.sn)}
        >
          {record.lockStatus === 1 && (
            <Icon
              type="lock"
              title="已锁定"
              style={{
                color: '#ff4d4f'
              }}
            />
          )}
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
      pageSizeOptions: ['5', '10', '20', '50'],
      autoReplace: true,
      autoCallback: (selection, selectData) => {
        this.checkOptionsDisable(selection, selectData)
      }
    }),
    innerPath: undefined,
    // initValues: {},
    disabledButton: {}
  }

  // 表格行选中 根据选定数据判断按钮状态
  checkOptionsDisable = (selection, selectData) => {
    let disabledButton = {}
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
    this.setState({ disabledButton })
  }

  // 表格行选中
  onSelectChange = (selection, selectData) => {
    this.checkOptionsDisable(selection, selectData)
  }

  /**
   * 当搜索条件下来处理
   * @memberof Terminal
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

  // 表格onChange的回调
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

  // 列表搜索
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

  // 新增、编辑成功后回调
  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  // 分配用户
  setUser = sns => {
    this.setState({ inner: '分配用户' }, this.setUserDrawer.pop(sns))
    this.currentDrawer = this.setUserDrawer
  }

  // 设置外设控制
  setSafePolicy = () => {
    this.setState({ inner: '设置外设控制' })
    this.setSafePolicyDrawer.pop(this.tablex.getSelection())
    this.currentDrawer = this.setSafePolicyDrawer
  }

  // 设置准入控制
  setAccessPolicy = () => {
    this.setState({ inner: '设置准入控制' })
    this.setAccessPolicyDrawer.pop(this.tablex.getSelection())
    this.currentDrawer = this.setAccessPolicyDrawer
  }

  // 发送消息
  sendMessage = (sn, selectData) => {
    this.setState({ inner: '发送消息' })

    this.sendMessageDrawer.pop(sn, selectData)
    // this.sendMessageDrawer.drawer.show()
    this.currentDrawer = this.sendMessageDrawer
  }

  // 查看详情
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
  sendOrder = (order, sns) => {
    const tcData = JSON.parse(JSON.stringify(this.tablex.state.data))
      .filter(item => {
        return sns.indexOf(item.sn) > -1
      })
      .map(item => {
        return { name: item.name, sn: item.sn }
      })
    terminalApi.directiveTerminal({ sns, command: order }).then(res => {
      wrapResponse(res)
        .then(() => {
          notification.success({ message: '操作成功' })
          this.tablex.refresh(this.state.tableCfg)
        })
        .catch(error => {
          if (
            Array.isArray(JSON.parse(error.message)) &&
            JSON.parse(error.message).length > 0
          ) {
            handleTcMessage(JSON.parse(error.message), tcData)
          } else {
            message.error(error.message || error || '操作失败')
          }
        })
    })
  }

  /**
   * @memberof Terminal
   * @param sn 终端sn
   * @description 接入所选终端
   * @author linghu
   */
  admitAccessTerminal = sns => {
    const tcData = JSON.parse(JSON.stringify(this.tablex.state.data))
      .filter(item => {
        return sns.indexOf(item.sn) > -1
      })
      .map(item => {
        return { name: item.name, sn: item.sn }
      })
    terminalApi.admitAccessTerminal({ sns }).then(res => {
      wrapResponse(res)
        .then(() => {
          notification.success({ message: '接入成功' })
          this.tablex.refresh(this.state.tableCfg)
        })
        .catch(error => {
          if (
            Array.isArray(JSON.parse(error.message)) &&
            JSON.parse(error.message).length > 0
          ) {
            handleTcMessage(JSON.parse(error.message), tcData)
          } else {
            message.error(error.message || error || '接入失败')
          }
        })
    })
  }

  // 终端编辑
  editTerminal = (name, data) => {
    this.setState({ inner: name || '未命名' }, this.editDrawer.pop(data))
    this.currentDrawer = this.editDrawer
  }

  // 删除终端
  deleteTerminal = (sn, title = '确定删除所选数据?') => {
    const sns = Array.isArray(sn) ? [...sn] : [sn]
    const self = this
    const tcData = JSON.parse(JSON.stringify(this.tablex.state.data))
      .filter(item => {
        return sns.indexOf(item.sn) > -1
      })
      .map(item => {
        return { name: item.name, sn: item.sn }
      })
    confirm({
      title,
      onOk() {
        terminalApi.deleteTerminal({ sns }).then(res =>
          wrapResponse(res)
            .then(() => {
              notification.success({ message: '删除成功' })
              self.tablex.refresh(self.state.tableCfg)
            })
            .catch(error => {
              if (
                Array.isArray(JSON.parse(error.message)) &&
                JSON.parse(error.message).length > 0
              ) {
                handleTcMessage(JSON.parse(error.message), tcData)
              } else {
                message.error(error.message || error || '删除失败')
                error.type === 'timeout' &&
                  self.tablex.refresh(self.state.tableCfg)
                console.log(error)
              }
            })
        )
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
          onClick={() => this.deleteTerminal(this.tablex.getSelection())}
          disabled={disabledButton.disabledDelete}
        >
          删除
        </Menu.Item>
        <Menu.Item
          key="restart"
          onClick={() => this.sendOrder('restart', this.tablex.getSelection())}
          disabled={disabledButton.disabledShutdown}
        >
          重启
        </Menu.Item>
        <Menu.Item
          key="lock"
          onClick={() => this.sendOrder('lock', this.tablex.getSelection())}
          disabled={disabledButton.disabledShutdown}
        >
          锁定
        </Menu.Item>
        <Menu.Item
          key="unlock"
          onClick={() => this.sendOrder('unlock', this.tablex.getSelection())}
          disabled={disabledButton.disabledShutdown}
        >
          解锁
        </Menu.Item>
        <Menu.Item
          key="sendMessage"
          onClick={() =>
            this.sendMessage(
              this.tablex.getSelection(),
              this.tablex.getSelectData()
            )
          }
          disabled={disabledButton.disabledSendMessage}
        >
          发送消息
        </Menu.Item>
        <Menu.Item
          key="setSafePolicy"
          onClick={() => this.setSafePolicy()}
          disabled={disabledButton.disabledDelete}
        >
          设置外设控制
        </Menu.Item>
        <Menu.Item
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
          description={
            '云终端(Cloud terminal) 提供云桌面服务的载体。功耗小，寿命长，一个用户可在云终端运行多种多个云桌面，而且本地无数据存储，提供更安全的工作环境，且零维护。'
          }
        />
        {/* {!this.state.inner && (
            <Reminder tips="平台通过向终端提供统一的接口，能够同时管理多款国产化安全云终端。"></Reminder>
          )} */}
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                onClick={() =>
                  this.sendOrder('shutdown', this.tablex.getSelection())
                }
                disabled={disabledButton.disabledShutdown}
              >
                关机
              </Button>
              <Button
                onClick={() => this.setUser(this.tablex.getSelection())}
                disabled={disabledButton.disabledSetUser}
              >
                分配用户
              </Button>

              <Button
                onClick={() =>
                  this.admitAccessTerminal(this.tablex.getSelection())
                }
                disabled={disabledButton.disabledAdmitAccess}
              >
                允许接入
              </Button>
              <Dropdown overlay={moreButton}>
                <Button>
                  更多 <Icon type="down" />
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
          />
          <SetSafePolicyDrawer
            onRef={ref => {
              this.setSafePolicyDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
          />
          <SetAccessPolicyDrawer
            onRef={ref => {
              this.setAccessPolicyDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
          />
          <SendMessageDrawer
            onRef={ref => {
              this.sendMessageDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
