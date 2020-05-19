/* eslint-disable react/no-string-refs */
import React from 'react'
import { Button, Modal, Dropdown, Icon, notification, message } from 'antd'
import { Tablex } from '@/components'
import produce from 'immer'
import desktopsApi from '@/services/desktops'
import poolsApi from '@/services/pools'
import {
  getColumns,
  getMoreButton,
  vmDisabledButton,
  vmFilterSorterTransform,
  defaultColumnsValue,
  defaultColumnsFilters,
  vmDisableAction
} from '@/pages/Common/VmTableCfg'
import { downloadVV } from '@/utils/tool'
import { checkAuth, checkAuthDiscrete } from '@/utils/checkPermissions'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const { confirm } = Modal
export default class Desktop extends React.Component {
  action = {
    title: '操作',
    width: 120,
    dataIndex: 'action',
    defaultFilteredValue: defaultColumnsValue,
    filters: defaultColumnsFilters,
    render: (text, record) => {
      const disabledButton = vmDisableAction(record)
      const { id, name } = record
      const moreAction = getMoreButton({
        disabledButton,
        deleteFn: () => this.deleteVm(id, '确定删除该条数据?'),
        sendOrderFn: order => this.sendOrder(id, order),
        openConsoleFn: () => this.openConsole(id, name),
        removePermissionFn: () => this.removePermission(id),
        isInnerMore: true,
        isDuplicated: true,
        isPoolVmlist: true
      })
      return (
        <span className="opration-btn">
          <a
            disabled={disabledButton?.disabledRemovePermission}
            onClick={() => this.removePermission(id)}
            hidden={!checkAuth('security')}
          >
            回收权限
          </a>
          <a
            onClick={() => this.sendOrder(id, 'start')}
            disabled={disabledButton.disabledUp}
            hidden={!checkAuth('admin')}
          >
            开机
          </a>
          <Dropdown overlay={moreAction} placement="bottomRight">
            <a hidden={!checkAuth('admin')}>
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </span>
      )
    }
  }

  columnsArr = [...getColumns(true), this.action]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod: poolsApi.vmList,
      searchs: { poolId: this.props.poolId },
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined,
    disabledButton: {}
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
   *
   *
   * @memberof Desktop
   * 调用通用处理 返回排序 筛选处理后的search 和columnsList
   */
  onTableChange = (page, filter, sorter) => {
    const { searchs, columnsList } = vmFilterSorterTransform(
      filter,
      sorter,
      true
    )
    this.setState(
      produce(draft => {
        draft.tableCfg = {
          ...draft.tableCfg,
          columns: [...columnsList, this.action],
          searchs: {
            ...draft.tableCfg.searchs,
            ...searchs
          }
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  /**
   *
   *
   * @memberof Desktop
   */
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

  /**
   *
   *
   * @memberof Desktop
   */
  deleteVm = id => {
    const desktopIds = Array.isArray(id) ? [...id] : [id]
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
                self.tablex.refresh(self.state.tableCfg).then(delRes => {
                  // 如果删除后没有桌面 则重新请求桌面池
                  if (!delRes.data.total) {
                    notification.success({
                      message: '已删除池内所有虚拟机, 池自动删除'
                    })
                    setTimeout(() => {
                      self.props.onDeleteAll()
                    }, 1000)
                  }
                })
              } else {
                message.error(res.message || '删除失败')
              }
              resolve()
            })
            .catch(error => {
              message.error(error.message || error)
              if (error.type === 'timeout') {
                self.tablex.refresh(self.state.tableCfg).then(delRes => {
                  // 如果删除后没有桌面 则重新请求桌面池
                  if (!delRes.data.total) {
                    notification.success({
                      message: '已删除池内所有虚拟机, 池自动删除'
                    })
                    setTimeout(() => {
                      self.props.onDeleteAll()
                    }, 1000)
                  }
                })
              }
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
   * @memberof Desktop
   */
  removePermission = id => {
    const desktopIds = Array.isArray(id) ? [...id] : [id]
    const self = this
    confirm({
      title: '确定回收权限吗?',
      onOk() {
        return new Promise(resolve => {
          poolsApi
            .removePermission({ poolId: self.props.poolId, desktopIds })
            .then(res => {
              if (res.success) {
                notification.success({ message: '回收成功' })
                self.tablex.refresh(self.state.tableCfg)
              } else {
                message.error(res.message || '回收失败')
              }
              resolve()
            })
            .catch(error => {
              message.error(error.message || error)
              error.type === 'timeout' &&
                self.tablex.refresh(self.state.tableCfg)
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
   * @memberof Desktop
   */
  search = (key, value) => {
    const searchs = { poolId: this.props.poolId }
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...searchs
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
    )
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

  render() {
    const { disabledButton } = this.state
    const moreButton = getMoreButton({
      disabledButton: this.state?.disabledButton,
      deleteFn: () => this.deleteVm(this.tablex.getSelection()),
      sendOrderFn: order => this.sendOrder(this.tablex.getSelection(), order),
      removePermissionFn: () =>
        this.removePermission(this.tablex.getSelection()),
      isDuplicated: true,
      isPoolVmlist: true
    })
    return (
      <React.Fragment>
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                disabled={disabledButton?.disabledRemovePermission}
                onClick={() =>
                  this.removePermission(this.tablex.getSelection())
                }
                hidden={!checkAuth('security') || !checkAuthDiscrete()}
              >
                回收权限
              </Button>
              <Button
                disabled={disabledButton?.disabledUp}
                onClick={() =>
                  this.sendOrder(this.tablex.getSelection(), 'start')
                }
                hidden={!checkAuth('admin')}
              >
                开机
              </Button>
              <Button
                disabled={disabledButton?.disabledDown}
                onClick={() =>
                  this.sendOrder(this.tablex.getSelection(), 'shutdown')
                }
                hidden={!checkAuth('admin')}
              >
                关机
              </Button>
              <Dropdown
                overlay={moreButton}
                disabled={disabledButton?.disabledMore}
              >
                <Button hidden={!checkAuth('admin')}>
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
