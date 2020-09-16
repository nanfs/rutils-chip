/* eslint-disable react/no-string-refs */
import React from 'react'
import { Button, Modal, Dropdown, Icon, notification, message } from 'antd'
import { Tablex } from '@/components'
import produce from 'immer'
import desktopsApi from '@/services/desktops'
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
import { downloadFile, wrapResponse, handleVmMessage } from '@/utils/tool'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const { confirm } = Modal
export default class Desktop extends React.Component {
  action = {
    title: '操作',
    width: 130,
    dataIndex: 'action',
    className: 'opration-btn',
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
        <span>
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
      searchs: { templateId: this.props.templateId, neededPoolDesktop: 1 },
      apiMethod,
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
    const self = this
    confirm({
      title: '确定删除该条数据?',
      onOk() {
        return new Promise(resolve => {
          desktopsApi
            .delVm({ desktopIds })
            .then(res => {
              wrapResponse(res)
                .then(() => {
                  notification.success({ message: '删除成功' })
                  self.tablex.refresh(self.state.tableCfg)
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
      downloadFile(res, name, 'vv')
    })
  }

  render() {
    const { disabledButton } = this.state
    const moreButton = getMoreButton({
      disabledButton: this.state?.disabledButton,
      deleteFn: () => this.deleteVm(this.tablex.getSelection()),
      sendOrderFn: order => this.sendOrder(this.tablex.getSelection(), order),
      isDuplicated: true
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
                  更多 <Icon type="down" />
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
