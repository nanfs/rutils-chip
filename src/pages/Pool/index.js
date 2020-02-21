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
import DetailDrawer from './chip/DetailDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import InnerPath from '@/components/InnerPath'
import SelectSearch from '@/components/SelectSearch'
import produce from 'immer'
import poolsApi from '@/services/pools'
import { Diliver } from '@/components/Title'
import { columns, apiMethod, vmColumns, vmApiMethod } from './chip/TableCfg'
import './index.scss'

export default class Pool extends React.Component {
  opration = {
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
    initValues: {},
    disbaledButton: {},
    vmDisbaledButton: {}
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  sendOrder = (id, order) => {
    const ids = !Array.isArray(id) ? [id] : [...id]
    poolsApi
      .sendOrder({ ids, order })
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

  turnOn = () => {
    const ids = this.state.vmTableCfg.selection
    this.sendOrder(ids, 'turnOn')
  }

  turnOff = () => {
    const ids = this.state.vmTableCfg.selection
    this.sendOrder(ids, 'turnOff')
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
    this.setState({ inner: '新建池' }, this.addDrawer.drawer.show())
    this.currentDrawer = this.addDrawer
  }

  deletePool = () => {
    const { selection: id } = this.state.tableCfg
    const ids = !Array.isArray(id) ? [id] : [...id]
    poolsApi
      .delPool({ ids })
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
    const { selection: id } = this.state.tableCfg
    const ids = !Array.isArray(id) ? [id] : [...id]
    poolsApi
      .deleteVm({ ids })
      .then(res => {
        if (res.success) {
          notification.success({ message: '删除成功' })
          this.vmTablex.refresh(this.state.vmTableCfg)
        } else {
          message.error(res.message || '删除失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  editPool = () => {
    this.setState(
      { inner: '编辑池', initValues: this.state.tableCfg.selectData[0] },
      this.editDrawer.drawer.show()
    )
    this.currentDrawer = this.editDrawer
  }

  setUser = () => {
    this.setState({ inner: '分配用户' }, this.setUserDrawer.drawer.show())
    this.currentDrawer = this.setUserDrawer
  }

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.vmTableCfg.searchs = {
          ...draft.vmTableCfg.searchs,
          ...searchs
        }
      }),
      () => this.vmTablex.refresh(this.state.vmTableCfg)
    )
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
            onRow={record => {
              return {
                onClick: event => {
                  this.search('poolId', record.id)
                }
              }
            }}
          />
          <Diliver />
          <ToolBar>
            <BarLeft>
              <Button onClick={this.turnOn}>开机</Button>
              <Button onClick={this.turnOff}>关机</Button>
              <Button onClick={this.getConsole}>打开控制台</Button>
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
            className="no-select-bg"
            tableCfg={this.state.vmTableCfg}
            onSelectChange={this.onVmSelectChange}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
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
          />
          <SetUserDrawer
            onRef={ref => {
              this.setUserDrawer = ref
            }}
            selection={this.state.tableCfg.selection}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
