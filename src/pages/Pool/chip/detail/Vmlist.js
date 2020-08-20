/* eslint-disable react/no-string-refs */
import React from 'react'
import { Button, Modal, Dropdown, Icon, notification, message } from 'antd'
import produce from 'immer'
import { Tablex } from '@/components'
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
import { downloadVV, wrapResponse, handleVmMessage } from '@/utils/tool'

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
            onClick={() => this.sendOrder(id, 'start')}
            disabled={disabledButton.disabledUp}
          >
            开机
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

  columnsArr = [...getColumns(true), this.action]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod: poolsApi.vmList,
      searchs: { poolId: this.props.poolId },
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50'],
      autoReplace: true,
      autoCallback: (selection, selectData) => {
        this.checkOptionsDisable(selection, selectData)
      }
    }),
    innerPath: undefined,
    disabledButton: {}
  }

  // 判断操作
  checkOptionsDisable = (selection, selectData) => {
    const disabledButton = vmDisabledButton(selection, selectData)
    this.setState({ disabledButton })
  }

  onSelectChange = (selection, selectData) => {
    this.checkOptionsDisable(selection, selectData)
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
    const desktopIds = !Array.isArray(id) ? [id] : [...id]
    const vmData = JSON.parse(JSON.stringify(this.tablex.state.data))
      .filter(item => {
        return desktopIds.indexOf(item.id) > -1
      })
      .map(item => {
        return { name: item.name, id: item.id }
      })
    desktopsApi
      .sendOrder({ desktopIds, directive })
      .then(res => {
        wrapResponse(res)
          .then(() => {
            notification.success({ message: '操作成功' })
            this.tablex.refresh(this.state.tableCfg)
          })
          .catch(error => {
            if (
              Array.isArray(JSON.parse(error.message)) &&
              JSON.parse(error.message).length > 0
            ) {
              handleVmMessage(JSON.parse(error.message), vmData)
            } else {
              message.error(error.message || '操作失败')
            }
          })
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
    const vmData = JSON.parse(JSON.stringify(this.tablex.state.data))
      .filter(item => {
        return desktopIds.indexOf(item.id) > -1
      })
      .map(item => {
        return { name: item.name, id: item.id }
      })
    confirm({
      title: '确定删除该条数据?',
      onOk: () => {
        desktopsApi
          .delVm({ desktopIds })
          .then(res =>
            wrapResponse(res)
              .then(() => {
                notification.success({ message: '删除成功' })
                this.tablex.refresh(this.state.tableCfg).then(delRes => {
                  // 如果删除后没有桌面 则重新请求桌面池
                  if (!delRes.data.total) {
                    notification.success({
                      message: '已删除池内所有虚拟机, 池自动删除'
                    })
                    setTimeout(() => {
                      this.props.onDeleteAll()
                    }, 1000)
                  }
                })
              })
              .catch(error => {
                if (
                  Array.isArray(JSON.parse(error.message)) &&
                  JSON.parse(error.message).length > 0
                ) {
                  handleVmMessage(JSON.parse(error.message), vmData)
                } else {
                  message.error(error.message || '删除失败')
                }
              })
          )
          .catch(error => {
            message.error(error.message || error)
            if (error.type === 'timeout') {
              this.tablex.refresh(this.state.tableCfg).then(delRes => {
                // 如果删除后没有桌面 则重新请求桌面池
                if (!delRes.data.total) {
                  notification.success({
                    message: '已删除池内所有虚拟机, 池自动删除'
                  })
                  setTimeout(() => {
                    this.props.onDeleteAll()
                  }, 1000)
                }
              })
            }
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
      onOk: () => {
        poolsApi
          .removePermission({ poolId: self.props.poolId, desktopIds })
          .then(res =>
            wrapResponse(res).then(() => {
              notification.success({ message: '回收成功' })
              this.tablex.refresh(this.state.tableCfg)
            })
          )
          .catch(error => {
            message.error(error.message || error)
            error.type === 'timeout' && this.tablex.refresh(this.state.tableCfg)
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

  // 打开控制台显示现在文件命名
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
                disabled={disabledButton?.disabledUp}
                onClick={() =>
                  this.sendOrder(this.tablex.getSelection(), 'start')
                }
              >
                开机
              </Button>
              <Button
                disabled={disabledButton?.disabledDown}
                onClick={() =>
                  this.sendOrder(this.tablex.getSelection(), 'shutdown')
                }
              >
                关机
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
