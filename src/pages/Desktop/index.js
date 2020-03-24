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
import { osStatusRender } from '@/utils/tableRender'
import { columns, apiMethod } from '@/pages/Common/VmTableCfg'
import './index.less'

const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
const { confirm } = Modal
export default class Desktop extends React.Component {
  vmName = {
    title: '基本信息',
    dataIndex: 'name',
    sorter: {
      compare: (a, b) => a.name - b.name
    },
    render: (text, record) => {
      return (
        <a
          className="detail-link"
          onClick={() => this.detailVm(record.name, record.id)}
        >
          <span>
            {osStatusRender(record.os)} {record.name}
          </span>
        </a>
      )
    }
  }

  columnsArr = [this.vmName, ...columns]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
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

  patchOrder = directive => {
    const ids = this.tablex.getSelection()
    this.sendOrder(ids, directive)
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

  deleteVm = () => {
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

  editVm = () => {
    const id = this.tablex.getSelection()[0]
    this.setState({ inner: '编辑桌面' }, this.editDrawer.pop(id))
    this.currentDrawer = this.editDrawer
  }

  detailVm = (name, id) => {
    this.setState({ inner: name }, this.detailDrawer.pop(id))
    this.currentDrawer = this.detailDrawer
  }

  // TODO 格式不一致
  openConsole = () => {
    const { name, id } = this.tablex.getSelection()[0]
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
      // 后端排序 使用 0-升序  1-降序
      const { order, field } = sorter
      searchs.sort = field || undefined
      searchs.order = order || undefined
    }
    const statusList = []
    filter.status &&
      filter.status.forEach(function(v) {
        statusList.push(...v)
      })
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...searchs,
          status: statusList
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  // TODO 修改开关机等 禁用条件
  render() {
    const searchOptions = [{ label: '名称', value: 'name' }]
    const { disabledButton } = this.state
    const moreButton = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={this.deleteVm}
          disabled={disabledButton.disabledDelete}
        >
          删除
        </Menu.Item>
        <Menu.Item
          key="2"
          disabled={disabledButton.disabledUp}
          onClick={() => this.patchOrder('start')}
        >
          开机
        </Menu.Item>
        <Menu.Item
          key="3"
          disabled={disabledButton.disabledDown}
          onClick={() => this.patchOrder('shutdown')}
        >
          关机
        </Menu.Item>
        <Menu.Item
          key="4"
          disabled={disabledButton.disabledOff}
          onClick={() => this.patchOrder('poweroff')}
        >
          断电
        </Menu.Item>
        <Menu.Item
          key="5"
          disabled={disabledButton.disabledRestart}
          onClick={() => this.patchOrder('restart')}
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
                onClick={this.editVm}
                disabled={disabledButton.disabledEdit}
              >
                编辑桌面
              </Button>
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
