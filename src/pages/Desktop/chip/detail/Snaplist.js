/* eslint-disable react/no-string-refs */
import React from 'react'
import { Button, Modal, notification, message } from 'antd'
import { Tablex } from '@/components'
import desktopsApi from '@/services/desktops'
import { wrapResponse } from '@/utils/tool'
import { columns, apiMethod } from './Snap/SnapTableCfg'
import AddSnapModal from './Snap/AddSnapModal'
import DetailRender from './Snap/DetailRender'

const { createTableCfg, TableWrap, ToolBar } = Tablex
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

  componentDidMount = () => {
    this.loadVmDetail()
  }

  loadVmDetail = () => {
    return desktopsApi.detail(this.props.vmId).then(res =>
      wrapResponse(res)
        .then(() => {
          const { status, snapInPreview } = res.data
          // 重刷一次判断选项
          this.setState({ status, snapInPreview }, () =>
            this.onSelectChange([], [])
          )
        })
        .catch(error => {
          message.error(error.message || error)
          console.log(error)
        })
    )
  }

  preSetDisable = ({ status, snapInPreview }) => {
    let preDisable = {}
    // 预览状态 &&  关机状态
    if (snapInPreview && status === 0) {
      preDisable = {
        disabledDelete: true,
        disabledCheck: true,
        disabledCreate: true
      }
    }
    // 预览状态 &&  开机状态
    if (snapInPreview && status === 1) {
      preDisable = {
        disabledDelete: true,
        disabledCheck: true,
        disabledCreate: true,
        disableCancel: true,
        disableCommit: true
      }
    }
    // 默认状态 && 关机状态
    if (!snapInPreview && status === 0) {
      preDisable = {
        disableCancel: true,
        disableCommit: true
      }
    }
    // 默认状态 && 开机状态
    if (!snapInPreview && status === 1) {
      preDisable = {
        disableCancel: true,
        disableCommit: true,
        disabledCheck: true
      }
    }
    console.log(
      snapInPreview && status === 0,
      status === 0,
      snapInPreview,
      preDisable
    )
    return preDisable
  }

  onSelectChange = (selection, selectData) => {
    const { status, snapInPreview } = this.state
    let disabledButton = this.preSetDisable({ status, snapInPreview })
    // 只支持单个删除
    if (selection.length !== 1) {
      this.setState({ currentSnap: undefined })
      disabledButton = {
        ...disabledButton,
        disabledDelete: true,
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
            disabledCheck: true,
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
    desktopsApi
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
    desktopsApi
      .checkSnap({
        vmId: this.props.vmId,
        snapId: this.tablex.getSelection()[0]
      })
      .then(res =>
        wrapResponse(res)
          .then(() => {
            info({
              title: '预览快照成功',
              content: <p>请在桌面预览快照,预览结束后继续操作</p>,
              onOk: () => {
                this.setState({ currentSnap: this.tablex.getSelection()[0] })
                this.tablex.refresh(this.state.tableCfg)
                setTimeout(() => this.loadVmDetail(), 5000)
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

  // 使用快照
  useSnap = () => {
    confirm({
      title: '确认应用当前快照吗?',
      content: '应用快照成功后 会删除当前快照之后所有数据!',
      onOk: this.commitSnap(),
      onCancel() {}
    })
  }

  // 应用快照处理
  commitSnap = () => {
    desktopsApi
      .commitSnap({ vmId: this.props.vmId })
      .then(res =>
        wrapResponse(res).then(() => {
          notification.success({ message: '应用快照成功' })
          this.setState({ currentSnap: undefined })
          this.tablex.refresh(this.state.tableCfg)
          this.loadVmDetail()
        })
      )
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  // 取消应用快照
  cancelSnap = () => {
    desktopsApi
      .cancelSnap({ vmId: this.props.vmId })
      .then(res =>
        wrapResponse(res).then(() => {
          notification.success({ message: '撤销快照成功' })
          this.setState({ currentSnap: undefined })
          this.tablex.refresh(this.state.tableCfg)
          this.loadVmDetail()
        })
      )
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  deleteSnap = () => {
    const snapId = this.tablex.getSelection()[0]
    confirm({
      title: '确定删除所选数据?',
      onOk: () => {
        desktopsApi
          .deleteSnap({ vmId: this.props.vmId, snapId })
          .then(res =>
            wrapResponse(res).then(() => {
              notification.success({ message: '删除成功' })
              this.tablex.refresh(this.state.tableCfg)
            })
          )
          .catch(error => {
            message.error(error.message || error)
          })
      },
      onCancel() {}
    })
  }

  render() {
    const { disabledButton, currentSnap, snapInPreview } = this.state
    return (
      <React.Fragment>
        <TableWrap>
          <ToolBar>
            <Button
              disabled={disabledButton.disabledCreate}
              onClick={() => {
                this.addSnapModal.pop(this.props.vmId)
              }}
            >
              创建
            </Button>
            <Button
              disabled={disabledButton.disabledCheck}
              onClick={this.checkSnap}
            >
              预览
            </Button>
            <Button
              onClick={this.commitSnap}
              disabled={disabledButton.disableCommit}
              hidden={!currentSnap && !snapInPreview}
            >
              提交
            </Button>
            <Button
              onClick={this.cancelSnap}
              disabled={disabledButton.disableCancel}
              hidden={!currentSnap && !snapInPreview}
            >
              撤销
            </Button>
            <Button
              disabled={disabledButton.disabledDelete}
              onClick={this.deleteSnap}
            >
              删除
            </Button>
            {snapInPreview && (
              <span className="drawer-set-tips">当前虚拟机正处于预览状态</span>
            )}
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
          onSuccess={() => this.tablex.refresh(this.state.tableCfg)}
          onRef={ref => {
            this.addSnapModal = ref
          }}
        ></AddSnapModal>
      </React.Fragment>
    )
  }
}
