/* eslint-disable react/no-string-refs */
import React from 'react'
import { Button, Modal, notification, message } from 'antd'
import { Tablex } from '@/components'
import desktopApi from '@/services/desktops'
import { columns, apiMethod } from './Snap/SnapTableCfg'
import AddSnapModal from './Snap/AddSnapModal'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const { confirm, info } = Modal
export default class Desktop extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    disabledButton: {}
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
        if (item.boot) {
          disabledButton = {
            ...disabledButton,
            disabledDelete: true
          }
        }
      })
    }
    this.setState({ disabledButton })
  }

  checkSnap = () => {
    info({
      title: '预览快照',
      content: <p>请在桌面预览快照,预览结束后继续操作</p>,
      onOk: () => {
        this.setState({ currentSnap: this.tablex.getSelection()[0] })
      }
    })
  }

  useSnap = () => {
    desktopApi
      .useSnap(this.state.currentSnap)
      .then(res => {
        this.setState({ currentSnap: undefined })
        notification.success({ message: '应用快照成功' })
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  cancelSnap = () => {
    desktopApi
      .cancelSnap(this.state.currentSnap)
      .then(res => {
        this.setState({ currentSnap: undefined })
        notification.success({ message: '撤销应用' })
      })
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
        return new Promise((resolve, reject) => {
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
              console.log(error)
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
