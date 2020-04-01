/* eslint-disable react/no-string-refs */
import React from 'react'
import {
  Button,
  Modal,
  Dropdown,
  Menu,
  Icon,
  notification,
  message
} from 'antd'

import { Tablex } from '@/components'
import produce from 'immer'
import desktopsApi from '@/services/desktops'
import { columns, apiMethod } from '@/pages/Common/VmTableCfg'
import { downloadVV } from '@/utils/tool'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const { confirm } = Modal
export default class Desktop extends React.Component {
  vmName = {
    title: '桌面名称',
    dataIndex: 'name',
    render: (text, record) => {
      return <span>{record.name}</span>
    }
  }

  action = {
    title: '操作',
    width: 130,
    dataIndex: 'action',
    render: (text, record) => {
      const moreAction = (
        <Menu>
          <Menu.Item
            key="8"
            onClick={() => {
              desktopsApi.openConsole({ desktopId: record.id }).then(res => {
                downloadVV(res, record.name)
              })
            }}
            disabled={record.status !== 1 || record.assignedUsers}
          >
            打开控制台
          </Menu.Item>
          <Menu.Item
            key="2"
            disabled={record.status !== 0 && record.status !== 13}
            onClick={() => this.patchOrder(record.id, 'start')}
          >
            开机
          </Menu.Item>
          <Menu.Item
            key="3"
            disabled={record.status === 0}
            onClick={() => this.patchOrder(record.id, 'shutdown')}
          >
            关机
          </Menu.Item>
          <Menu.Item
            key="4"
            disabled={record.status === 0}
            onClick={() => this.patchOrder(record.id, 'poweroff')}
          >
            断电
          </Menu.Item>
          <Menu.Item
            key="5"
            disabled={record.status === 0 || record.status === 10}
            onClick={() => this.patchOrder(record.id, 'restart')}
          >
            重启
          </Menu.Item>
        </Menu>
      )
      return (
        <span>
          <a
            style={{ marginRight: 16 }}
            onClick={() => {
              this.deleteVm(record.id)
            }}
          >
            删除
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

  columnsArr = [this.vmName, ...columns, this.action]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      // 筛选模板ID 不过滤池里面桌面
      searchs: { templateId: this.props.templateId, neededPoolDesktop: 1 },
      apiMethod,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined,
    disabledButton: {}
  }

  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length !== 1) {
      disabledButton = {
        ...disabledButton,
        disabledEdit: true,
        disabledOpenConsole: true,
        disabledAddTem: true
      }
    }
    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true,
        disabledSetUser: true,
        disabledUp: true,
        disabledDown: true,
        disabledOff: true,
        disabledRestart: true
      }
    } else {
      selectData.forEach(item => {
        if (item.status !== 0 && item.status !== 13) {
          disabledButton = {
            ...disabledButton,
            disabledUp: true
          }
        }
        if (item.status === 0) {
          disabledButton = {
            ...disabledButton,
            disabledDown: true,
            disabledRestart: true,
            disabledOff: true
          }
        }
        if (item.status === 10) {
          disabledButton = {
            ...disabledButton,
            disabledRestart: true
          }
        }
        if (item.status !== 1) {
          disabledButton = {
            ...disabledButton,
            disabledOpenConsole: true
          }
        }
      })
    }
    this.setState({ disabledButton })
  }

  patchOrders = directive => {
    const ids = this.tablex.getSelection()
    this.sendOrder(ids, directive)
  }

  patchOrder = (id, directive) => {
    this.sendOrder(id, directive)
  }

  sendOrder = (id, directive) => {
    const ids = !Array.isArray(id) ? [id] : [...id]
    desktopsApi
      .sendOrder({ desktopIds: ids, directive })
      .then(res => {
        if (res.success) {
          notification.success({ message: '操作成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '操作失败')
        }
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  deleteVms = () => {
    const desktopIds = this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise(resolve => {
          desktopsApi
            .delVm({ desktopIds })
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
              resolve()
              console.log(error)
            })
        })
      },
      onCancel() {}
    })
  }

  deleteVm = id => {
    const desktopIds = [id]
    const self = this
    confirm({
      title: '确定删除该条数据?',
      onOk() {
        return new Promise(resolve => {
          desktopsApi
            .delVm({ desktopIds })
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
              resolve()
              console.log(error)
            })
        })
      },
      onCancel() {}
    })
  }

  onTableChange = (page, filter, sorter) => {
    const searchs = { templateId: this.props.templateId, neededPoolDesktop: 1 }
    if (sorter) {
      const { order, field } = sorter
      searchs.sort = field || undefined
      searchs.order = order || undefined
    }
    const statusList = []
    filter.status &&
      filter.status.forEach(function(v) {
        statusList.push(...v)
      })
    const { clusterName, hostName, datacenterName } = filter
    const columnsList = []
    if (filter.action) {
      columns.forEach(function(item) {
        if (filter.action.indexOf(item.dataIndex) !== -1) {
          columnsList.push(item)
        }
      })
      this.setState({
        tableCfg: {
          ...this.state.tableCfg,
          columns: [this.vmName, ...columnsList, this.action]
        }
      })
    }

    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...searchs,
          status: statusList,
          clusters: clusterName,
          hosts: hostName,
          datacenters: datacenterName
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  openConsole = () => {
    const { name, id } = this.tablex.getSelectData()[0]
    desktopsApi.openConsole({ desktopId: id }).then(res => {
      downloadVV(res, name)
    })
  }

  // TODO 修改开关机等 禁用条件
  render() {
    const { disabledButton } = this.state
    const moreButton = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={this.deleteVms}
          disabled={disabledButton.disabledDelete}
        >
          删除
        </Menu.Item>
        <Menu.Item
          key="4"
          disabled={disabledButton.disabledOff}
          onClick={() => this.patchOrders('poweroff')}
        >
          断电
        </Menu.Item>
        <Menu.Item
          key="5"
          disabled={disabledButton.disabledRestart}
          onClick={() => this.patchOrders('restart')}
        >
          重启
        </Menu.Item>
      </Menu>
    )
    return (
      <React.Fragment>
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                disabled={disabledButton.disabledUp}
                onClick={() => this.patchOrders('start')}
              >
                开机
              </Button>
              <Button
                disabled={disabledButton.disabledDown}
                onClick={() => this.patchOrders('shutdown')}
              >
                关机
              </Button>
              <Button
                disabled={disabledButton.disabledOpenConsole}
                onClick={this.openConsole}
              >
                打开控制台
              </Button>
              <Dropdown overlay={moreButton}>
                <Button>
                  更多操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </BarLeft>
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
        </TableWrap>
      </React.Fragment>
    )
  }
}
