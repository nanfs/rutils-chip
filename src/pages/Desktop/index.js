import React from 'react'
import { Button, Dropdown, Menu, Icon, notification, message } from 'antd'
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

import { columns, apiMethod } from './chip/TableCfg'
import './index.scss'

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
          onClick={this.sendOrder.bind(this, record.id, 'shutdown')}
        />
        <MyIcon
          type="order-up"
          title="开机"
          onClick={this.sendOrder.bind(this, record.id, 'start')}
        />
        <MyIcon
          type="order-poweroff"
          title="断电"
          onClick={this.sendOrder.bind(this, record.id, 'start')}
        />
        <MyIcon
          type="vm-rebootinprogress"
          title="重启"
          onClick={this.sendOrder.bind(this, record.id, 'start')}
        />
        <MyIcon
          type="order-console-end"
          title="关闭控制台"
          onClick={this.sendOrder.bind(this, record.id, 'start')}
        />
        <MyIcon
          type="order-console"
          title="打开控制台"
          onClick={this.sendOrder.bind(this, record.id, 'start')}
        />
        <MyIcon
          type="order-setuser"
          title="分配用户"
          onClick={() => this.setUserDrawer.pop(record.id)}
        />
        <MyIcon
          type="template1"
          title="添加模板"
          onClick={() => this.addTemplateModal.pop(record.id)}
        />
        <Icon
          type="form"
          title="编辑"
          onClick={() => this.editDrawer.pop(record.id)}
        />
        <MyIcon
          type="order-info"
          title="详情"
          onClick={() => this.detailDrawer.pop(record.id)}
        />
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
        console.log(errors)
      })
  }

  patchOrder = directive => {
    const ids = this.tablex.getSelection()
    this.sendOrder(ids, directive)
  }

  turnOn = () => {
    const ids = this.state.tableCfg.selection
    this.sendOrder(ids, 'start')
  }

  turnOff = () => {
    const ids = this.state.tableCfg.selection
    this.sendOrder(ids, 'shutdown')
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

  createVm = () => {
    this.setState({ inner: '新建桌面' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  deleteVm = () => {
    const { selection: id } = this.state.tableCfg
    const ids = !Array.isArray(id) ? [id] : [...id]
    desktopsApi
      .delete({ ids })
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

  editVm = () => {
    this.setState(
      { inner: '编辑桌面', initValues: this.state.tableCfg.selectData[0] },
      this.editDrawer.drawer.show()
    )
    this.currentDrawer = this.editDrawer
  }

  detailVm = () => {
    this.setState({ inner: '桌面详情' }, this.detailDrawer.drawer.show())
    this.currentDrawer = this.detailDrawer
  }

  setUser = () => {
    this.setState({ inner: '分配用户' }, this.setUserDrawer.pop())
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
        <Menu.Item key="2" onClick={() => this.patchOrder('start')}>
          开机
        </Menu.Item>
        <Menu.Item key="3" onClick={() => this.patchOrder('shutdown')}>
          关机
        </Menu.Item>
        <Menu.Item key="4" onClick={() => this.patchOrder('poweroff')}>
          断电
        </Menu.Item>
        <Menu.Item key="5" onClick={() => this.patchOrder('restart')}>
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
              {/* <Button
                onClick={this.editVm}
                disabled={disbaledButton.disabledEdit}
              >
                编辑桌面
              </Button> */}
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
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onSuccess={this.onSuccess}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            onSuccess={this.onSuccess}
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
