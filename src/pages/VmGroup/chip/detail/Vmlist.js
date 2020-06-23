/* eslint-disable react/no-string-refs */
import React from 'react'
import { Button, Modal, Dropdown, Icon, notification, message } from 'antd'
import { Tablex } from '@/components'
import produce from 'immer'
import desktopsApi from '@/services/desktops'
import vmgroupsApi from '@/services/vmgroups'
import {
  getColumns,
  getMoreButton,
  vmDisabledButton,
  vmFilterSorterTransform,
  defaultColumnsValue,
  defaultColumnsFilters,
  vmDisableAction,
  apiMethod
} from '@/pages/Common/VmTableCfg'
import { downloadVV, wrapResponse } from '@/utils/tool'
import MoveInModal from './MoveInModal'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const { confirm } = Modal
export default class Desktop extends React.Component {
  action = {
    title: '操作',
    width: 130,
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
        isInnerMore: true,
        isDuplicated: true
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

  columnsArr = [...getColumns(), this.action]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      // 筛选模板ID 不过滤池里面桌面
      searchs: { groupId: this.props.groupId },
      apiMethod,
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
    this.setState({
      disabledButton: { ...disabledButton, disabledRemove: !selection.length }
    })
  }

  //
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
    const { searchs, columnsList } = vmFilterSorterTransform(filter, sorter)
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

  // 移出当前桌面组
  remove = id => {
    const desktopIds = Array.isArray(id) ? [...id] : [id]
    confirm({
      title: '确定移出所选桌面?',
      onOk: () => {
        vmgroupsApi
          .remove({ id: this.props.groupId, desktopIds })
          .then(res => {
            wrapResponse(res).then(() => {
              notification.success({ message: '移出成功' })
              this.tablex.refresh(this.state.tableCfg)
            })
          })
          .catch(error => {
            message.error(error.message || error)
            error.type === 'timeout' && this.tablex.refresh(this.state.tableCfg)
          })
      },
      onCancel() {}
    })
  }

  // 移出当前桌面组
  moveIn = () => {
    this.moveInModal.pop(this.props.groupId)
  }

  /**
   *
   *
   * @memberof Desktop
   */
  deleteVm = id => {
    const desktopIds = Array.isArray(id) ? [...id] : [id]
    confirm({
      title: '确定删除该条数据?',
      onOk: () => {
        desktopsApi
          .delete({ desktopIds })
          .then(res => {
            wrapResponse(res).then(() => {
              notification.success({ message: '删除成功' })
              this.tablex.refresh(this.state.tableCfg)
            })
          })
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
      sendOrderFn: order => this.sendOrder(this.tablex.getSelection(), order)
    })
    return (
      <React.Fragment>
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button type="primary" onClick={() => this.moveIn()}>
                迁入
              </Button>
              <Button
                disabled={disabledButton?.disabledRemove}
                onClick={() => this.remove(this.tablex.getSelection())}
              >
                移出
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
        <MoveInModal
          onRef={ref => {
            this.moveInModal = ref
          }}
          onSuccess={() => this.tablex.search(this.state.tableCfg)}
        />
      </React.Fragment>
    )
  }
}
