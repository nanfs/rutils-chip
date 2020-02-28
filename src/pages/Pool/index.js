import React from 'react'
import { Button, notification, message } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import InnerPath from '@/components/InnerPath'
import MyIcon from '@/components/MyIcon'
import SelectSearch from '@/components/SelectSearch'
import produce from 'immer'
import poolsApi from '@/services/pools'
import desktopsApi from '@/services/desktops'
import Title, { Diliver } from '@/components/Title'
import { columns, apiMethod } from './chip/TableCfg'
import { vmColumns, vmApiMethod } from './chip/VmTableCfg'
import './index.scss'

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
          onClick={() => this.sendOrder(record.id, 'shutdown')}
        />
        <MyIcon
          type="order-up"
          title="开机"
          onClick={() => this.sendOrder(record.id, 'start')}
        />
        <MyIcon
          type="order-poweroff"
          title="断电"
          onClick={() => this.sendOrder(record.id, 'poweroff')}
        />
        <MyIcon
          type="vm-rebootinprogress"
          title="重启"
          onClick={() => this.sendOrder(record.id, 'restart')}
        />
        {/* //TODO 缺少接口 */}
        <MyIcon
          type="order-console-end"
          title="关闭控制台"
          onClick={() => this.sendOrder(record.id, 'start')}
        />
        <MyIcon
          type="order-console"
          title="打开控制台"
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
      pageSizeOptions: ['5', '10']
    }),
    vmTableCfg: createTableCfg({
      columns: this.vmColumnsArr,
      apiMethod: vmApiMethod,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    }),
    innerPath: undefined,
    disbaledButton: {},
    vmDisbaledButton: {}
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
    this.setState({ disbaledButton })
  }

  onVmSelectChange = (selection, selectData) => {
    let vmDisbaledButton = {}
    if (selection.length !== 1) {
      vmDisbaledButton = { ...vmDisbaledButton, disabledEdit: true }
    }
    if (selection.length === 0) {
      vmDisbaledButton = {
        ...vmDisbaledButton,
        disabledDelete: true,
        disabledSetUser: true
      }
    }
    this.setState({ vmDisbaledButton })
  }

  getConsole = () => {
    const id = this.state.vmTableCfg.selection[0]
    poolsApi
      .getVmConsole(id)
      .then(res => {
        if (res.success) {
          notification.success({ message: '获取成功' })
        } else {
          message.error(res.message || '获取失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  createPool = () => {
    this.setState({ inner: '新建池' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  deletePool = () => {
    // TODO 添加删除禁用 只能单个删除
    const poolId = this.tablex.getSelection()[0]
    poolsApi
      .delPool(poolId)
      .then(res => {
        if (res.success) {
          notification.success({ message: '删除成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '删除失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  deleteVm = () => {
    const desktopIds = this.vmTablex.getSelection()
    desktopsApi
      .delVm({ desktopIds })
      .then(res => {
        if (res.success) {
          notification.success({ message: '删除成功' })
          this.vmTablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '删除失败')
        }
      })
      .catch(errors => {
        message.error(errors || 'catch error')
        console.log(errors)
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
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.currentName = name
        draft.vmTableCfg.searchs = {
          ...draft.vmTableCfg.searchs,
          ...searchs
        }
      }),
      () => this.vmTablex.refresh(this.state.vmTableCfg)
    )
  }

  afterPoolLoad = () => {
    console.log(
      'afterPoolLoad',
      this.tablex.getData(),
      this.tablex.getData()[0].id,
      this.tablex.getData()[0].name
    )
    this.search(
      'poolId',
      this.tablex.getData() && this.tablex.getData()[0].id,
      this.tablex.getData() && this.tablex.getData()[0].name
    )
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
  }

  render() {
    const searchOptions = [{ label: '名称', value: 'name' }]
    const { disbaledButton, vmDisbaledButton } = this.state

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
                disabled={disbaledButton.disabledEdit}
              >
                编辑池
              </Button>
              <Button
                onClick={this.setUser}
                disabled={disbaledButton.disabledSetUser}
              >
                分配用户
              </Button>
              <Button
                onClick={this.deletePool}
                disabled={disbaledButton.disabledDelete}
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
                  this.search('poolId', record.id, record.name)
                }
              }
            }}
          />
          <Diliver />
          <Title
            slot={
              this.state.currentName && `${this.state.currentName} 的桌面列表`
            }
          ></Title>
          <ToolBar>
            <BarLeft>
              <Button
                onClick={() =>
                  this.sendOrder(this.vmTablex.getSelection(), 'start')
                }
              >
                开机
              </Button>
              <Button
                onClick={() =>
                  this.sendOrder(this.vmTablex.getSelection(), 'shutdown')
                }
              >
                关机
              </Button>
              {/* <Button onClick={this.getConsole}>打开控制台</Button> */}
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
            stopFetch={true}
            className="no-select-bg"
            tableCfg={this.state.vmTableCfg}
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
