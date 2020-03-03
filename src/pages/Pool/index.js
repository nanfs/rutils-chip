import React from 'react'
import { Button, notification, Modal, message } from 'antd'
import {
  Tablex,
  SelectSearch,
  InnerPath,
  MyIcon,
  Diliver,
  TitleInfo
} from '@/components'
import { downloadVV } from '@/utils/tool'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import produce from 'immer'
import poolsApi from '@/services/pools'
import desktopsApi from '@/services/desktops'
import { columns, apiMethod } from './chip/TableCfg'
import { vmColumns, vmApiMethod } from './chip/VmTableCfg'
import './index.less'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex

export default class Pool extends React.Component {
  opration = {
    title: '操作',
    dataIndex: 'opration',
    className: 'opration',
    render: (text, record) => (
      <div>
        <MyIcon
          type="order-down"
          title="关机"
          disabled={record.status === 0}
          onClick={() => this.sendOrder(record.id, 'shutdown')}
        />
        <MyIcon
          type="order-up"
          title="开机"
          disabled={record.status !== 0 && record.status !== 13}
          onClick={() => this.sendOrder(record.id, 'start')}
        />
        <MyIcon
          type="order-poweroff"
          title="断电"
          disabled={record.status === 0}
          onClick={() => this.sendOrder(record.id, 'poweroff')}
        />
        <MyIcon
          type="vm-rebootinprogress"
          title="重启"
          disabled={record.status === 10 || record.status === 0}
          onClick={() => this.sendOrder(record.id, 'restart')}
        />
        {/* //TODO 缺少接口 */}
        {/* <MyIcon
          type="order-console-end"
          title="关闭控制台"
          onClick={() => this.sendOrder(record.id, 'start')}
        /> */}
        <MyIcon
          type="order-console"
          title="打开控制台"
          disabled={record.status !== 1}
          onClick={() => this.openConsole(record.name, record.id)}
        />
      </div>
    )
  }

  vmColumnsArr = [...vmColumns, this.opration]

  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    vmTableCfg: createTableCfg({
      columns: this.vmColumnsArr,
      apiMethod: vmApiMethod,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined,
    disabledButton: {},
    vmDisbaledButton: {},
    currentPool: {}
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
          this.vmTablex.refresh(this.state.vmTableCfg)
        } else {
          message.error(res.message || '操作失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length !== 1) {
      disabledButton = {
        ...disabledButton,
        disabledEdit: true,
        disabledDelete: true,
        disabledSetUser: true
      }
    }
    // if (selection.length === 0) {
    //   disabledButton = {
    //     ...disabledButton
    //   }
    // }
    this.setState({ disabledButton })
  }

  onVmSelectChange = (selection, selectData) => {
    let vmDisbaledButton = {}
    if (selection.length !== 1) {
      vmDisbaledButton = { ...vmDisbaledButton, disabledEdit: true }
    }

    if (selection.length === 0) {
      vmDisbaledButton = {
        ...vmDisbaledButton,
        disabledUp: true,
        disabledDown: true,
        disabledDelete: true
      }
    } else {
      selectData.forEach(item => {
        if (item.status !== 0 && item.status !== 13) {
          vmDisbaledButton = {
            ...vmDisbaledButton,
            disabledUp: true
          }
        }
        if (item.status === 0) {
          vmDisbaledButton = {
            ...vmDisbaledButton,
            disabledDown: true
          }
        }
      })
    }
    this.setState({ vmDisbaledButton })
  }

  openConsole = (name, desktopId) => {
    desktopsApi.openConsole({ desktopId }).then(res => {
      downloadVV(res, name)
    })
  }

  createPool = () => {
    this.setState({ inner: '新建池' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  deletePool = () => {
    // TODO 添加删除禁用 只能单个删除
    const poolId = this.tablex.getSelection()[0]
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        poolsApi
          .delPool(poolId)
          .then(res => {
            if (res.success) {
              notification.success({ message: '删除成功' })
              self.tablex.refresh(self.state.tableCfg)
            } else {
              message.error(res.message || '删除失败')
            }
          })
          .catch(errors => {
            message.error(errors)
            console.log(errors)
          })
      },
      onCancel() {}
    })
  }

  deleteVm = () => {
    const desktopIds = this.vmTablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        desktopsApi
          .delVm({ desktopIds })
          .then(res => {
            if (res.success) {
              notification.success({ message: '删除成功' })
              self.vmTablex.refresh(self.state.vmTableCfg)
              self.tablex.replace(self.state.tableCfg)
            } else {
              message.error(res.message || '删除失败')
            }
          })
          .catch(errors => {
            message.error(errors || 'catch error')
            console.log(errors)
          })
      },
      onCancel() {}
    })
  }

  editPool = () => {
    this.setState(
      { inner: '编辑池' },
      this.editDrawer.pop(this.tablex.getSelection()[0])
    )
    this.currentDrawer = this.editDrawer
  }

  setUser = () => {
    this.setState(
      { inner: '分配用户' },
      this.setUserDrawer.pop(this.tablex.getSelection()[0])
    )
    this.currentDrawer = this.setUserDrawer
  }

  search = (key, value, name) => {
    const searchs = { poolId: this.state.currentPool.id }
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.currentName = name
        draft.vmTableCfg.searchs = {
          // ...draft.vmTableCfg.searchs,
          status: draft.vmTableCfg.searchs.status,
          ...searchs
        }
      }),
      () => this.vmTablex.refresh(this.state.vmTableCfg)
    )
  }

  onVmTableChange = (a, filter) => {
    const statusList = []
    filter.status.forEach(function(v, i) {
      statusList.push(...v)
    })
    this.setState(
      produce(draft => {
        draft.vmTableCfg.searchs = {
          ...draft.vmTableCfg.searchs,
          status: statusList
        }
      }),
      () => this.vmTablex.refresh(this.state.vmTableCfg)
    )
  }

  afterPoolLoad = () => {
    const data = (this.tablex.getData() && this.tablex.getData()[0]) || {}
    const { id, name } = data
    this.setState(
      { currentPool: { id, name } },
      this.search('poolId', id, name)
    )
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
  }

  render() {
    const searchOptions = [{ label: '名称', value: 'name' }]
    const { disabledButton, vmDisbaledButton } = this.state

    return (
      <React.Fragment>
        <InnerPath
          location="桌面池管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.createPool}>创建池</Button>
              <Button
                onClick={this.editPool}
                disabled={disabledButton.disabledEdit}
              >
                编辑池
              </Button>
              <Button
                onClick={this.setUser}
                disabled={disabledButton.disabledSetUser}
              >
                分配用户
              </Button>
              <Button
                onClick={this.deletePool}
                disabled={disabledButton.disabledDelete}
              >
                删除池
              </Button>
            </BarLeft>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
            onSelectChange={this.onSelectChange}
            afterLoad={this.afterPoolLoad}
            onRow={record => {
              return {
                onClick: () => {
                  const { id, name } = record
                  this.setState(
                    { currentPool: { id, name } },
                    this.search('poolId', id, name)
                  )
                }
              }
            }}
          />
          <Diliver />
          <TitleInfo
            style={{ paddingTop: '10px', marginBottom: '0px' }}
            slot={
              this.state.currentName && `${this.state.currentName} 的桌面列表`
            }
          />
          <ToolBar>
            <BarLeft>
              <Button
                onClick={() =>
                  this.sendOrder(this.vmTablex.getSelection(), 'start')
                }
                disabled={vmDisbaledButton.disabledUp}
              >
                开机
              </Button>
              <Button
                onClick={() =>
                  this.sendOrder(this.vmTablex.getSelection(), 'shutdown')
                }
                disabled={vmDisbaledButton.disabledDown}
              >
                关机
              </Button>
              <Button
                onClick={this.deleteVm}
                disabled={vmDisbaledButton.disabledDelete}
              >
                删除桌面
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
              this.vmTablex = ref
            }}
            stopAutoFetch={true}
            className="no-select-bg"
            tableCfg={this.state.vmTableCfg}
            onChange={this.onVmTableChange}
            onSelectChange={this.onVmSelectChange}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
          />
          <SetUserDrawer
            onRef={ref => {
              this.setUserDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
            selection={this.state.tableCfg.selection}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
