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
import AddTemplateModal from './chip/AddTemplateModal'
import InnerPath from '@/components/InnerPath'
import MyIcon from '@/components/MyIcon'
import SelectSearch from '@/components/SelectSearch'
import produce from 'immer'
import desktopsApi from '@/services/desktops'
import { downloadVV } from '@/utils/tool'
import { columns, apiMethod } from './chip/TableCfg'
import './index.scss'

const { confirm } = Modal
export default class Desktop extends React.Component {
  options = {
    title: '操作',
    dataIndex: 'opration',
    className: 'opration',
    render: (text, record) => (
      <div>
        <MyIcon
          type="order-down"
          title="关机"
          disabled={record.status === 0}
          onClick={this.sendOrder.bind(this, record.id, 'shutdown')}
        />
        <MyIcon
          type="order-up"
          title="开机"
          disabled={record.status === 1}
          onClick={this.sendOrder.bind(this, record.id, 'start')}
        />
        <MyIcon
          type="order-poweroff"
          title="断电"
          disabled={record.status === 0}
          onClick={this.sendOrder.bind(this, record.id, 'poweroff')}
        />
        <MyIcon
          type="order-paused"
          title="暂停"
          disabled={record.status !== 1}
          onClick={this.sendOrder.bind(this, record.id, 'pause')}
        />
        <MyIcon
          type="vm-rebootinprogress"
          title="重启"
          disabled={record.status === 10 || record.status === 0}
          onClick={this.sendOrder.bind(this, record.id, 'restart')}
        />
        {/* //TODO 缺少接口 */}
        {/* <MyIcon
          type="order-console-end"
          title="关闭控制台"
          onClick={this.sendOrder.bind(this, record.id, 'start')}
        /> */}
        <MyIcon
          type="order-console"
          title="打开控制台"
          disabled={record.status !== 1}
          onClick={this.openConsole.bind(this, record.name, record.id)}
        />
        <MyIcon
          type="order-setuser"
          title="分配用户"
          onClick={this.setUser.bind(this, [record.id])}
        />
        <MyIcon
          type="template1"
          title="创建模板"
          onClick={() => this.addTemplateModal.pop(record.id)}
        />
        <Icon
          type="form"
          title="编辑"
          onClick={this.editVm.bind(this, record.id)}
        />
        <MyIcon
          type="order-info"
          title="详情"
          onClick={this.detailVm.bind(this, record.id)}
        />
      </div>
    )
  }

  columnsArr = [...columns, this.options]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      paging: { size: 10 },
      pageSizeOptions: ['10', '20', '50']
    }),
    innerPath: undefined,
    disbaledButton: {}
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
        message.error(errors)
        console.log(errors)
      })
  }

  patchOrder = directive => {
    const ids = this.tablex.getSelection()
    this.sendOrder(ids, directive)
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
        disabledSetUser: true,
        disabledUp: true,
        disabledDown: true,
        disabledOff: true,
        disabledRestart: true
      }
    } else {
      selectData.forEach(item => {
        if (item.status !== 0) {
          disbaledButton = {
            ...disbaledButton,
            disabledUp: true
          }
        } else if (item.status === 0) {
          disbaledButton = {
            ...disbaledButton,
            disabledDown: true,
            disabledRestart: true,
            disabledOff: true
          }
        } else if (item.status === 10) {
          disbaledButton = {
            ...disbaledButton,
            disabledRestart: true
          }
        }
      })
    }
    this.setState({ disbaledButton })
  }

  createVm = () => {
    this.setState({ inner: '新建桌面' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  deleteVm = () => {
    const desktopIds = this.tablex.getSelection()
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        desktopsApi
          .delVm({ desktopIds })
          .then(res => {
            if (res.success) {
              notification.success({ message: '删除成功' })
              this.tablex.refresh(this.state.tableCfg)
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

  editVm = id => {
    this.setState({ inner: '编辑桌面' }, this.editDrawer.pop(id))
    this.currentDrawer = this.editDrawer
  }

  detailVm = id => {
    this.setState({ inner: '桌面详情' }, this.detailDrawer.pop(id))
    this.currentDrawer = this.detailDrawer
  }

  // TODO 格式不一致
  openConsole = (name, desktopId) => {
    desktopsApi.openConsole({ desktopId }).then(res => {
      downloadVV(res, name)
    })
  }

  setUser = () => {
    this.setState(
      { inner: '分配用户' },
      this.setUserDrawer.pop(this.tablex.getSelection())
    )
    this.currentDrawer = this.setUserDrawer
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
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

  onTableChange = (a, filter) => {
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...filter
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  // TODO 修改开关机等 禁用条件
  render() {
    const searchOptions = [{ label: '名称', value: 'name' }]
    const { disbaledButton } = this.state
    const moreButton = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={this.deleteVm}
          disabled={disbaledButton.disabledDelete}
        >
          删除
        </Menu.Item>
        <Menu.Item
          key="2"
          disabled={disbaledButton.disabledUp}
          onClick={() => this.patchOrder('start')}
        >
          开机
        </Menu.Item>
        <Menu.Item
          key="3"
          disabled={disbaledButton.disabledDown}
          onClick={() => this.patchOrder('shutdown')}
        >
          关机
        </Menu.Item>
        <Menu.Item
          key="4"
          disabled={disbaledButton.disabledOff}
          onClick={() => this.patchOrder('poweroff')}
        >
          断电
        </Menu.Item>
        <Menu.Item
          key="5"
          disabled={disbaledButton.disabledRestart}
          onClick={() => this.patchOrder('restart')}
        >
          重启
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
                onClick={this.setUser}
                disabled={disbaledButton.disabledSetUser}
              >
                分配用户
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
