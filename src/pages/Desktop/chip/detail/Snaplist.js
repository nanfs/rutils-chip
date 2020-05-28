/* eslint-disable react/no-string-refs */
import React from 'react'
import { Button, Modal, notification, message, Divider } from 'antd'
import { Tablex } from '@/components'
import desktopApi from '@/services/desktops'
import { wrapResponse } from '@/utils/tool'
import { columns, apiMethod } from './Snap/SnapTableCfg'
import AddSnapModal from './Snap/AddSnapModal'
import DetailRender from './Snap/DetailRender'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const { confirm, info } = Modal
export default class Desktop extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      expandedRowRender: record => this.getDetail(record.snapshotId),
      rowKey: 'snapshotId',
      searchs: { vmId: this.props.vmId },
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    disabledButton: {},
    snapDetailList: []
  }

  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length !== 1) {
      this.setState({ currentSnap: undefined })
      disabledButton = {
        ...disabledButton,
        disabledCheck: true
      }
    }
    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true
      }
    } else {
      selectData.forEach(item => {
        // 如果快照 是active 不能删除
        if (item.snapshotType === 'ACTIVE') {
          disabledButton = {
            ...disabledButton,
            disabledDelete: true
          }
        }
      })
    }
    this.setState({ disabledButton })
  }

  // 获取快照详情
  getDetail = snapId => {
    const { snapDetailList } = this.state
    const detailObj = snapDetailList.find(item => item.id === snapId)
    if (detailObj) {
      return DetailRender(detailObj.detail)
    }
    desktopApi
      .detailSnap({
        vmId: this.props.vmId,
        snapId
      })
      .then(res =>
        wrapResponse(res)
          .then(() => {
            // 缓存详情
            const snapDetail = { id: snapId, detail: res.data }
            this.setState({ snapDetailList: [...snapDetailList, snapDetail] })
            return DetailRender(res.data)
          })
          .catch(error =>
            message.error(error.message || error || '详情获取失败')
          )
      )
  }

  // 预览快照
  checkSnap = () => {
    desktopApi
      .checkSnap({
        vmId: this.props.vmId,
        snapId: this.tablex.getSelection()[0]
      })
      .then(res =>
        wrapResponse(res)
          .then(() => {
            info({
              title: '预览快照',
              content: <p>请在桌面预览快照,预览结束后继续操作</p>,
              onOk: () => {
                this.setState({ currentSnap: this.tablex.getSelection()[0] })
              }
            })
          })
          .catch(error =>
            message.error(
              error.message || error || '快照预览失败, 请联系管理员'
            )
          )
      )
  }

  // 应用快照
  useSnap = () => {
    desktopApi
      .useSnap({ vmId: this.props.vmId })
      .then(res =>
        wrapResponse(res).then(() => {
          this.setState({ currentSnap: undefined })
          notification.success({ message: '应用快照成功' })
        })
      )
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  // 取消应用快照
  cancelSnap = () => {
    desktopApi
      .cancelSnap({ vmId: this.props.vmId })
      .then(res =>
        wrapResponse(res).then(() => {
          this.setState({ currentSnap: undefined })
          notification.success({ message: '撤销应用' })
        })
      )
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  deleteSnap = () => {
    const snapIds = this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise(resolve => {
          desktopApi
            .deleteSnap({ snapIds })
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
              error.type === 'timeout' &&
                self.tablex.refresh(self.state.tableCfg)
              resolve()
            })
        })
      },
      onCancel() {}
    })
  }

  render() {
    const { disabledButton } = this.state
    return (
      <React.Fragment>
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                onClick={() => {
                  this.addSnapModal.pop(this.props.vmId)
                }}
              >
                创建
              </Button>
              <Button
                disabled={
                  disabledButton.disabledCheck || this.state.currentSnap
                }
                onClick={this.checkSnap}
              >
                预览
              </Button>
              <Button onClick={this.useSnap} hidden={!this.state.currentSnap}>
                提交
              </Button>
              <Button
                onClick={this.cancelSnap}
                hidden={!this.state.currentSnap}
              >
                撤销
              </Button>
              <Button
                disabled={disabledButton.disabledDelete}
                onClick={this.deleteSnap}
              >
                删除
              </Button>
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
        <AddSnapModal
          onRef={ref => {
            this.addSnapModal = ref
          }}
        ></AddSnapModal>
      </React.Fragment>
    )
  }
}
