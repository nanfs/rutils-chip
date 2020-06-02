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
  action = {
    title: () => <span title="操作">操作</span>,
    width: 160,
    dataIndex: 'action',
    render: (text, record) => {
      const { disabledButton } = this.state
      if (record.status === 'IN_PREVIEW') {
        return (
          <span className="opration-btn">
            <a
              onClick={() => this.commitSnap()}
              disabled={disabledButton.disableCommit}
            >
              提交
            </a>
            <a
              onClick={() => this.cancelSnap()}
              disabled={disabledButton.disableCancel}
            >
              撤销
            </a>
          </span>
        )
      } else {
        return (
          <span className="opration-btn">
            {/* // 如果状态不OK不能操作 这里status为快照的状态 */}
            <a
              onClick={() => this.checkSnap(record.snapshotId)}
              disabled={disabledButton.disabledCheck || record.status !== 'OK'}
            >
              预览
            </a>
            {/* // 如果状态不OK不能操作 */}
            <a
              onClick={() => this.deleteSnap(record.snapshotId)}
              disabled={disabledButton.disabledDelete || record.status !== 'OK'}
            >
              删除
            </a>
          </span>
        )
      }
    }
  }

  state = {
    tableCfg: createTableCfg({
      columns: [...columns, this.action],
      apiMethod,
      expandedRowRender: record => this.getDetail(record.snapshotId),
      rowKey: 'snapshotId',
      hasRowSelection: false,
      searchs: { vmId: this.props.vmId },
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    disabledButton: {},
    snapDetailList: []
  }

  timer = null

  componentDidMount = () => {
    this.loadVmDetail()
    this.timer = setInterval(() => {
      this.loadVmDetail()
    }, 3000)
  }

  componentWillUnmount = () => {
    this.timer && clearInterval(this.timer)
  }

  loadVmDetail = () => {
    return desktopsApi.detail(this.props.vmId).then(res =>
      wrapResponse(res)
        .then(() => {
          const { status, snapInPreview } = res.data
          // 重刷一次判断选项
          this.setDisable({ status, snapInPreview })
          this.setState({ status, snapInPreview })
        })
        .catch(error => {
          message.error(error.message || error)
          console.log(error)
        })
    )
  }

  setDisable = ({ status, snapInPreview }) => {
    let disabledButton = {}
    // 预览状态 &&  关机状态
    if (snapInPreview && status === 0) {
      disabledButton = {
        disabledDelete: true,
        disabledCheck: true,
        disabledCreate: true
      }
    }
    // 预览状态 &&  其他状态
    if (snapInPreview && status !== 0) {
      disabledButton = {
        disabledDelete: true,
        disabledCheck: true,
        disabledCreate: true,
        disableCancel: true,
        disableCommit: true
      }
    }
    // 默认状态 && 关机状态
    if (!snapInPreview && status === 0) {
      disabledButton = {
        disableCancel: true,
        disableCommit: true
      }
    }
    // 默认状态 && 开机状态
    if (!snapInPreview && status === 1) {
      disabledButton = {
        disableCancel: true,
        disableCommit: true,
        disabledCheck: true
      }
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
  checkSnap = snapId => {
    desktopsApi
      .checkSnap({
        vmId: this.props.vmId,
        snapId
      })
      .then(res =>
        wrapResponse(res)
          .then(() => {
            info({
              title: '预览快照成功',
              content: <p>请在桌面预览快照,预览结束后继续操作</p>,
              onOk: () => {
                this.tablex.refresh(this.state.tableCfg)
                // 不用刷新 有自动刷新
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

  deleteSnap = snapId => {
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
    const { disabledButton, snapInPreview } = this.state
    return (
      <React.Fragment>
        <TableWrap>
          <ToolBar>
            <Button
              disabled={disabledButton.disabledCreate}
              onClick={() => {
                this.addSnapModal.pop(this.props.vmId, this.state.status)
              }}
            >
              创建
            </Button>
            <Button
              onClick={() => this.commitSnap()}
              disabled={disabledButton.disableCommit || !snapInPreview}
            >
              提交
            </Button>
            <Button
              onClick={() => this.cancelSnap()}
              disabled={disabledButton.disableCancel || !snapInPreview}
            >
              撤销
            </Button>
            {snapInPreview && (
              <span className="drawer-set-tips">当前虚拟机正处于预览状态</span>
            )}
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            autoReplace={true}
            tableCfg={this.state.tableCfg}
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
