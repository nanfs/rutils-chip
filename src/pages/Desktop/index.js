/* eslint-disable react/no-string-refs */
import React from 'react'
import { Button, Modal, Dropdown, Icon, notification, message } from 'antd'

import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import AddTemplateModal from './chip/AddTemplateModal'
import AttachIsoModal from './chip/AttachIsoModal'
import { InnerPath, SelectSearch, Tablex } from '@/components'
import produce from 'immer'
import desktopsApi from '@/services/desktops'
import { downloadVV } from '@/utils/tool'

import {
  columns,
  apiMethod,
  defaultColumnsFilters,
  defaultColumnsValue,
  vmDisabledButton,
  vmDisableAction,
  vmFilterSorterTransform,
  getMoreButton,
  searchOptions
} from '@/pages/Common/VmTableCfg'
import './index.less'

const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
const { confirm } = Modal

export default class Desktop extends React.Component {
  vmName = {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'name',
    ellipsis: true,
    sorter: true,
    render: (text, record) => {
      return <a onClick={() => this.detailVm(record.id, record.name)}>{text}</a>
    }
  }

  action = {
    title: () => <span title="操作">操作</span>,
    width: 130,
    dataIndex: 'action',
    defaultFilteredValue: defaultColumnsValue,
    filters: defaultColumnsFilters,
    render: (text, record) => {
      const disabledButton = vmDisableAction(record)
      const { id, name, datacenterId, currentCd } = record
      const moreAction = getMoreButton({
        disabledButton,
        deleteFn: () => this.deleteVm(id, '确定删除该条数据?'),
        sendOrderFn: order => this.sendOrder(id, order),
        setUserFn: () => this.setUser(id, name),
        openConsoleFn: () => this.openConsole(id, name),
        addTempFn: () => this.addTemplateModal.pop(id),
        attachIsoFn: () => this.attachIsoModal.pop(id, datacenterId, currentCd),
        isInnerMore: true
      })
      return (
        <span className="opration-btn">
          <a onClick={() => this.editVm(record.id, record.name)}>编辑</a>
          <Dropdown overlay={moreAction} placement="bottomRight">
            <a>
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </span>
      )
    }
  }

  columnsArr = [this.vmName, ...columns.slice(1), this.action]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      replaceTime: 5000,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    })
  }

  /**
   *
   *  @memberof Desktop
   * 调用通用判断 返回disabledButton
   */
  onSelectChange = (selection, selectData) => {
    const disabledButton = vmDisabledButton(selection, selectData)
    this.setState({ disabledButton })
  }

  /**
   * 当搜索条件下来处理
   *
   * @memberof Vmlog
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

  /**
   *
   *
   * @memberof Desktop
   * 调用通用处理 返回排序 筛选处理后的search 和columnsList
   */
  onTableChange = (page, filter, sorter) => {
    const { searchs, columnsList } = vmFilterSorterTransform(filter, sorter)
    const [colname, ...columnsFix] = columnsList
    this.setState(
      produce(draft => {
        draft.tableCfg = {
          ...draft.tableCfg,
          columns: [this.vmName, ...columnsFix, this.action],
          searchs: {
            ...draft.tableCfg.searchs,
            ...searchs
          }
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  /**
   *
   *
   * @memberof Desktop
   */
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

  /**
   *
   *
   * @memberof Desktop
   */
  onSuccess = () => {
    this.setState({ inner: undefined })
    this.tablex.refresh(this.state.tableCfg)
    this.currentDrawer.drawer.hide()
  }

  /**
   *
   *
   * @memberof Desktop
   */
  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  /**
   *
   *
   * @memberof Desktop
   */
  sendOrder = (id, directive) => {
    const ids = Array.isArray(id) ? [...id] : [id]
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

  /**
   * 添加虚拟机
   *
   * @memberof Desktop
   */
  createVm = () => {
    this.setState({ inner: '新建桌面' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  /**
   * 删除虚拟机
   * 支持批量
   * @memberof Desktop
   */
  deleteVm = (ids, title = '确定删除所选数据?') => {
    const desktopIds = Array.isArray(ids) ? [...ids] : [ids]
    const self = this
    confirm({
      title,
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

  /**
   *
   *
   * @param {*} id 通过id获取拉取详细数据
   * @param {*} name 通过name 显示编辑页面
   * @memberof Desktop
   */
  editVm = (id, name) => {
    this.setState({ inner: name }, this.editDrawer.pop(id))
    this.currentDrawer = this.editDrawer
  }

  detailVm = (id, name) => {
    this.setState({ inner: name }, this.detailDrawer.pop(id))
    this.currentDrawer = this.detailDrawer
  }

  /**
   *
   *
   * @param {*} name 显示现在文件命名
   * @param {*} id
   */
  openConsole = (id, name) => {
    desktopsApi.openConsole({ desktopId: id }).then(res => {
      downloadVV(res, name)
    })
  }

  setUser = (id, name) => {
    const ids = Array.isArray(id) ? id : [id]
    this.setState({ inner: name || '分配用户' }, this.setUserDrawer.pop(ids))
    this.currentDrawer = this.setUserDrawer
  }

  render() {
    const { disabledButton } = this.state
    const moreButton = getMoreButton({
      disabledButton: this.state?.disabledButton,
      deleteFn: () => this.deleteVm(this.tablex.getSelection()),
      sendOrderFn: order => this.sendOrder(this.tablex.getSelection(), order)
    })
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
              <Button onClick={this.createVm} type="primary">
                创建
              </Button>
              <Button
                onClick={() => this.setUser(this.tablex.getSelection())}
                disabled={disabledButton?.disabledSetUser}
              >
                分配用户
              </Button>
              <Dropdown
                overlay={moreButton}
                disabled={disabledButton?.disabledMore}
              >
                <Button>
                  更多操作 <Icon type="down" />
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
        <AttachIsoModal
          onRef={ref => {
            this.attachIsoModal = ref
          }}
        ></AttachIsoModal>
      </React.Fragment>
    )
  }
}
