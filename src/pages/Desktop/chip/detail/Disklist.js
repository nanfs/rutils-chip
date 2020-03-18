/* eslint-disable react/no-string-refs */
import React from 'react'
import { Button, Modal, notification, message } from 'antd'

import { Tablex } from '@/components'
import diskApi from '@/services/disks'
import { columns, apiMethod } from './DiskTableCfg'
import AddDiskModal from './AddDiskModal'
import EditDiskModal from './EditDiskModal'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const { confirm } = Modal
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

  deleteVm = () => {
    const desktopIds = this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise((resolve, reject) => {
          diskApi
            .delete({ desktopIds })
            .then(res => {
              if (res.success) {
                notification.success({ message: '删除成功' })
                self.tablex.refresh(self.state.tableCfg)
              } else {
                message.error(res.message || '删除失败')
              }
              resolve()
            })
            .catch(errors => {
              message.error(errors || 'catch error')
              resolve()
              console.log(errors)
            })
        })
      },
      onCancel() {}
    })
  }

  // TODO 修改开关机等 禁用条件
  render() {
    const { disabledButton } = this.state

    return (
      <React.Fragment>
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                onClick={() => {
                  this.addDiskModal.pop()
                }}
              >
                添加磁盘
              </Button>
              <Button
                disabled={disabledButton.disabledEdit}
                onClick={() => {
                  this.editDiskModal.pop(this.tablex.getSelectData()[0])
                }}
              >
                磁盘扩容
              </Button>
              <Button
                disabled={disabledButton.disabledDelete}
                onClick={this.deleteVm}
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
            onChange={this.onTableChange}
          />
        </TableWrap>
        <AddDiskModal
          onRef={ref => {
            this.addDiskModal = ref
          }}
        ></AddDiskModal>
        <EditDiskModal
          onRef={ref => {
            this.editDiskModal = ref
          }}
        ></EditDiskModal>
      </React.Fragment>
    )
  }
}
