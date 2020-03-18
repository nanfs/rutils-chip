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

import { SelectSearch, Tablex } from '@/components'
import produce from 'immer'
import desktopsApi from '@/services/desktops'
import { osStatusRender } from '@/utils/tableRender'
import { columns, apiMethod } from '@/pages/Common/VmTableCfg'
import { downloadVV } from '@/utils/tool'

const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
const { confirm } = Modal
export default class Desktop extends React.Component {
  vmName = {
    title: '基本信息',
    dataIndex: 'name',
    render: (text, record) => {
      return (
        <span>
          {osStatusRender(record.os)} {record.name}
        </span>
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

  patchOrder = directive => {
    const ids = this.tablex.getSelection()
    this.sendOrder(ids, directive)
  }

  deleteVm = () => {
    const desktopIds = this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise((resolve, reject) => {
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

  onTableChange = (a, filter) => {
    const statusList = []
    filter.status.forEach(function(v, i) {
      statusList.push(...v)
    })
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          status: statusList
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  openConsole = () => {
    const { name, id } = this.tablex.getSelection()[0]
    desktopsApi.openConsole({ desktopId: id }).then(res => {
      downloadVV(res, name)
    })
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
      </Menu>
    )
    return (
      <React.Fragment>
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                disabled={disabledButton.disabledUp}
                onClick={() => this.patchOrder('start')}
              >
                开机
              </Button>
              <Button
                disabled={disabledButton.disabledDown}
                onClick={() => this.patchOrder('shutdown')}
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
        </TableWrap>
      </React.Fragment>
    )
  }
}
