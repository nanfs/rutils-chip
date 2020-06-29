import React from 'react'
import { Button, message, notification, Modal } from 'antd'
import { Tablex, InnerPath } from '@/components'
import EditModal from './chip/EditModal'
import AddGroupModal from './chip/AddModal'
import DetailDrawer from './chip/DetailDrawer'
import PeakDrawer from './chip/PeakDrawer'
import MoveInModal from './chip/MoveInModal'
import DeleteModal from './chip/DeleteModal'
import AddVmDrawer from '@/pages/Desktop/chip/AddDrawer'
import { columns, apiMethod } from './chip/TableCfg'

const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
export default class Task extends React.Component {
  options = {
    title: '操作',
    dataIndex: 'opration',
    width: 180,
    render: (text, record) => {
      return (
        <span className="opration-btn">
          <a
            onClick={() =>
              this.addVm({ groupId: record.id, groupName: record.name })
            }
          >
            新增组桌面
          </a>
          <a onClick={() => this.editGroup(record)}>编辑</a>
          <a
            onClick={() =>
              this.deleteModal.pop({
                ids: [record.id],
                title: '确定删除该条数据'
              })
            }
          >
            删除
          </a>
        </span>
      )
    }
  }

  name = {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'name',
    ellipsis: true,
    render: (text, record) => {
      return (
        <a
          className="detail-link"
          onClick={() => this.detail(record.name, record)}
        >
          {text}
        </a>
      )
    }
  }

  columnsArr = [this.name, ...columns, this.options]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod
    }),
    innerPath: undefined,
    disabledButton: {}
  }

  // 默认都可以删除
  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true
      }
    }
    if (selection.length !== 1) {
      disabledButton = {
        ...disabledButton,
        disabledSetPeak: true,
        disabledMoveIn: true
      }
    }
    if (selectData.some(item => item.desktopNum === 0)) {
      disabledButton = {
        ...disabledButton,
        disabledSetPeak: true
      }
    }

    this.setState({ disabledButton })
  }

  //  编辑 新增成功后回调
  onSuccess = () => {
    this.onBack()
    this.tablex.refresh(this.state.tableCfg)
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  detail = (name, data) => {
    this.setState({ inner: name })
    this.detailDrawer.pop(data)
    this.currentDrawer = this.detailDrawer
  }

  setPeak = record => {
    const { name } = record
    this.setState({ inner: name })
    this.peakDrawer.pop(record)
    this.currentDrawer = this.peakDrawer
  }

  addGroup = () => {
    this.setState({ inner: '新建桌面组' }, this.addGroupModal.pop())
    this.currentDrawer = this.addGroupModal
  }

  addVm = ({ groupId, groupName }) => {
    this.setState(
      { inner: '新建组内虚拟机' },
      this.addVmModal.pop({ groupId, name: `${groupName}_vm` })
    )
    this.currentDrawer = this.addVmModal
  }

  moveIn = groupId => {
    this.moveInModal.pop(groupId)
  }

  editGroup = record => {
    this.setState({ inner: '编辑任务' }, this.editModal.pop(record))
    this.currentDrawer = this.editModal
  }

  render() {
    const { disabledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath
          location="桌面组管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={() => this.addGroup()} type="primary">
                创建
              </Button>
              <Button
                disabled={disabledButton.disabledMoveIn}
                onClick={() => this.moveIn()}
              >
                迁入
              </Button>
              <Button
                disabled={disabledButton.disabledSetPeak}
                onClick={() => this.setPeak(this.tablex.getSelectData()[0])}
              >
                预启动配置
              </Button>
              <Button
                disabled={disabledButton.disabledDelete}
                onClick={() =>
                  this.deleteModal.pop({ ids: this.tablex.getSelection() })
                }
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
          />
          <AddVmDrawer
            onRef={ref => {
              this.addVmModal = ref
            }}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
          <AddGroupModal
            onRef={ref => {
              this.addGroupModal = ref
            }}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
          <EditModal
            onRef={ref => {
              this.editModal = ref
            }}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
          <DeleteModal
            onRef={ref => {
              this.deleteModal = ref
            }}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
          <DetailDrawer
            onRef={ref => {
              this.detailDrawer = ref
            }}
            onClose={this.onBack}
          />
          <MoveInModal
            onRef={ref => {
              this.moveInModal = ref
            }}
            onSuccess={this.onSuccess}
          />
          <PeakDrawer
            onRef={ref => {
              this.peakDrawer = ref
            }}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
