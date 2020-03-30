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

import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import AddTemplateModal from './chip/AddTemplateModal'
import { InnerPath, SelectSearch, Tablex } from '@/components'
import produce from 'immer'
import desktopsApi from '@/services/desktops'
import { downloadVV } from '@/utils/tool'

import { columns, apiMethod } from '@/pages/Common/VmTableCfg'
import './index.less'

const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
const { confirm } = Modal
export default class Desktop extends React.Component {
  vmName = {
    title: '桌面名称',
    dataIndex: 'name',
    render: (text, record) => {
      return <a onClick={() => this.detailVm(record.name, record.id)}>{text}</a>
    }
  }

  action = {
    title: '操作',
    width: 130,
    dataIndex: 'action',
    filters: [
      { value: 'os', text: '操作系统' },
      { value: 'status', text: '状态' },
      { value: 'hostName', text: '主机' },
      { value: 'ip', text: 'IP' },
      { value: 'datacenterName', text: '数据中心' },
      { value: 'clusterName', text: '集群' },
      { value: 'assignedUsers', text: '已分配用户' },
      { value: 'isConsole', text: '控制台' },
      { value: 'onlineTime', text: '本次运行时长' },
      { value: 'cpuUsageRate', text: 'CPU' },
      { value: 'memoryUsageRate', text: '内存' },
      { value: 'networkUsageRate', text: '网络' }
    ],
    render: (text, record) => {
      const moreAction = (
        <Menu>
          <Menu.Item
            key="1"
            onClick={() => {
              this.setState(
                { inner: '编辑桌面' },
                this.editDrawer.pop(record.id)
              )
              this.currentDrawer = this.editDrawer
            }}
          >
            编辑
          </Menu.Item>
          <Menu.Item
            key="7"
            onClick={() => {
              this.setState(
                { inner: '分配用户' },
                this.setUserDrawer.pop([record.id])
              )
              this.currentDrawer = this.setUserDrawer
            }}
          >
            分配用户
          </Menu.Item>
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
          <Menu.Item
            key="6"
            onClick={() => this.addTemplateModal.pop(record.id)}
          >
            创建模板
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
      apiMethod,
      replaceTime: 5000,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined,
    disabledButton: {}
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
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

  patchOrders = directive => {
    const ids = this.tablex.getSelection()
    this.sendOrder(ids, directive)
  }

  patchOrder = (id, directive) => {
    this.sendOrder(id, directive)
  }

  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length !== 1) {
      disabledButton = {
        ...disabledButton,
        disabledEdit: true,
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
        disabledRestart: true,
        disabledOpenConsole: true
      }
    } else {
      selectData.forEach(item => {
        if (item.status !== 0 && item.status !== 13) {
          disabledButton = {
            ...disabledButton,
            disabledUp: true
          }
        }
        if (item.status !== 1) {
          disabledButton = {
            ...disabledButton,
            disabledOpenConsole: true
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
        // 如果有分配用户 管理员不能打开控制台
        if (item.assignedUsers) {
          disabledButton = {
            ...disabledButton,
            disabledOpenConsole: true
          }
        }
      })
    }
    this.setState({ disabledButton })
  }

  createVm = () => {
    this.setState({ inner: '新建桌面' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
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

  editVm = () => {
    const id = this.tablex.getSelection()[0]
    this.setState({ inner: '编辑桌面' }, this.editDrawer.pop(id))
    this.currentDrawer = this.editDrawer
  }

  detailVm = (name, id) => {
    this.setState({ inner: name }, this.detailDrawer.pop(id))
    this.currentDrawer = this.detailDrawer
  }

  openConsole = () => {
    console.log(this.tablex.getSelection())
    const { name, id } = this.tablex.getSelectData()[0]
    desktopsApi.openConsole({ desktopId: id }).then(res => {
      downloadVV(res, name)
    })
  }

  setUser = ids => {
    this.setState({ inner: '分配用户' }, this.setUserDrawer.pop(ids))
    this.currentDrawer = this.setUserDrawer
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          // ...draft.tableCfg.searchs,
          status: draft.tableCfg.searchs.status,
          ...searchs
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  onTableChange = (page, filter, sorter) => {
    const searchs = {}
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
          cluster: clusterName,
          hosts: hostName,
          datacenter: datacenterName
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  render() {
    const searchOptions = [
      { label: '名称', value: 'name' },
      { label: '主机名', value: 'hostName' },
      { label: '数据中心', value: 'datacenterName' },
      { label: '集群', value: 'clusterName' }
    ]
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
          key="2"
          disabled={disabledButton.disabledUp}
          onClick={() => this.patchOrders('start')}
        >
          开机
        </Menu.Item>
        <Menu.Item
          key="3"
          disabled={disabledButton.disabledDown}
          onClick={() => this.patchOrders('shutdown')}
        >
          关机
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
        <Menu.Item
          key="6"
          disabled={disabledButton.disabledAddTem}
          onClick={() =>
            this.addTemplateModal.pop(this.tablex.getSelection()[0])
          }
        >
          创建模板
        </Menu.Item>
      </Menu>
    )
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
                onClick={() => this.setUser(this.tablex.getSelection())}
                disabled={disabledButton.disabledSetUser}
              >
                分配用户
              </Button>
              <Button
                onClick={this.openConsole}
                disabled={disabledButton.disabledOpenConsole}
              >
                打开控制台
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
            autoReplace={true}
            replaceBreak={this.state.replaceBreak}
            tableCfg={this.state.tableCfg}
            onSelectChange={this.onSelectChange}
            onChange={this.onTableChange}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
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
          />
        </TableWrap>
        <AddTemplateModal
          onRef={ref => {
            this.addTemplateModal = ref
          }}
        ></AddTemplateModal>
      </React.Fragment>
    )
  }
}
