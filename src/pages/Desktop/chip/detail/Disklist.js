/* eslint-disable react/no-string-refs */
import React from 'react'
import { Button, Modal, notification, message } from 'antd'

import { Tablex } from '@/components'
import diskApi from '@/services/disks'
import { columns, apiMethod } from './Disk/DiskTableCfg'
import AddDiskModal from './Disk/AddDiskModal'
import EditDiskModal from './Disk/EditDiskModal'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const { confirm } = Modal
export default class Desktop extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      searchs: { vmId: this.props.vmId },
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    disabledButton: {}
  }

  // 磁盘 如果不是正常状态 不能编辑和删除
  // 如果虚拟机状态是开机状态 不能编辑和删除
  onSelectChange = (selection, selectData) => {
    const { status } = this.props
    let disabledButton = {}
    if (status === 1) {
      disabledButton = {
        ...disabledButton,
        disabledEdit: true,
        disabledDelete: true
      }
    }
    if (selection.length !== 1) {
      disabledButton = {
        ...disabledButton,
        disabledEdit: true
      }
    }
    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true
      }
    } else {
      selectData.forEach(item => {
        if (item.status !== 1) {
          disabledButton = {
            ...disabledButton,
            disabledDelete: true,
            disabledEdit: true
          }
        }
        if (item.isBoot) {
          disabledButton = {
            ...disabledButton,
            disabledDelete: true
          }
        }
      })
    }
    this.setState({ disabledButton })
  }

  delete = () => {
    const disks = this.tablex.getSelectData()
    const removeDiskVo = disks.map(item => ({
      diskId: item.id,
      storageDomainId: item.storageId
    }))
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise(resolve => {
          diskApi
            .delete({ vmId: self.props.vmId, removeDiskVo })
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
    const { vmId } = this.props
    return (
      <React.Fragment>
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                onClick={() => {
                  this.addDiskModal.pop(vmId)
                }}
              >
                添加磁盘
              </Button>
              <Button
                disabled={disabledButton.disabledEdit}
                onClick={() => {
                  this.editDiskModal.pop({
                    vmId,
                    ...this.tablex.getSelectData()[0]
                  })
                }}
              >
                磁盘扩容
              </Button>
              <Button
                disabled={disabledButton.disabledDelete}
                onClick={this.delete}
              >
                删除磁盘
              </Button>
            </BarLeft>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
            onSelectChange={this.onSelectChange}
          />
        </TableWrap>
        <AddDiskModal
          onRef={ref => {
            this.addDiskModal = ref
          }}
          onSuccess={() => this.tablex.refresh(this.state.tableCfg)}
        ></AddDiskModal>
        <EditDiskModal
          onRef={ref => {
            this.editDiskModal = ref
          }}
          onSuccess={() => this.tablex.refresh(this.state.tableCfg)}
        ></EditDiskModal>
      </React.Fragment>
    )
  }
}
