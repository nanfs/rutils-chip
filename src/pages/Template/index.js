import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import { Tablex, InnerPath, Reminder } from '@/components'
import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import templateApi from '@/services/template'
import { wrapResponse } from '@/utils/tool'
import ExportModal from '@/pages/Common/ExportModal'
import ImportModal from '@/pages/Common/ImportModal'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
export default class Template extends React.Component {
  options = {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'name',
    ellipsis: true,
    render: (text, record) => {
      return (
        <a
          className="detail-link"
          onClick={() => {
            this.setState(
              { inner: text },
              this.infoDrawer.pop(record.id, record)
            )
            this.currentDrawer = this.infoDrawer
          }}
        >
          {text}
        </a>
      )
    }
  }

  action = {
    title: '操作',
    dataIndex: 'opration',
    className: 'opration-btn',
    width: 200,
    render: (text, record) => {
      return (
        <span>
          <a onClick={() => this.editTem(record.name, record)}>编辑</a>
          <a onClick={() => this.exportModal.pop(record, true)}>导出</a>
          <a
            disabled={record.vmUsed !== '0'}
            onClick={() => {
              this.delTem(record.id, '确定删除该条数据?')
            }}
          >
            删除
          </a>
        </span>
      )
    }
  }

  columnsArr = [this.options, ...columns, this.action]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      expandedRowRender: false,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50'],
      autoReplace: true,
      autoCallback: (selection, selectData) => {
        this.checkOptionsDisable(selection, selectData)
      }
    }),
    innerPath: undefined
  }

  // 返回后 将inner path 置为空
  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  checkOptionsDisable(selection, selectData) {
    let disabledButton = {}
    this.setState({ selection, selectData })
    if (selection.length === 0) {
      disabledButton = { ...disabledButton, disabledDelete: true }
    }
    selectData.forEach(function(v) {
      if (v.vmUsed !== '0') {
        disabledButton = { ...disabledButton, disabledDelete: true }
      }
    })
    this.setState({ disabledButton })
  }

  // 成功后刷新表格
  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  onSelectChange = (selection, selectData) => {
    this.checkOptionsDisable(selection, selectData)
  }

  // 编辑模板
  editTem = (name, data) => {
    this.setState({ inner: name }, this.editDrawer.pop(data))
    this.currentDrawer = this.editDrawer
  }

  // 批量删除
  delTem = (id, title = '确定删除所选数据?') => {
    const ids = Array.isArray(id) ? [...id] : [id]
    const self = this
    confirm({
      title,
      onOk() {
        templateApi
          .delTem({ ids })
          .then(res => {
            wrapResponse(res).then(() => {
              notification.success({ message: '删除成功' })
              self.tablex.refresh(self.state.tableCfg)
            })
          })
          .catch(error => {
            message.error(error.message || error)
            error.type === 'timeout' && self.tablex.refresh(self.state.tableCfg)
          })
      },
      onCancel() {}
    })
  }

  /**
   *
   * 导入
   */
  importVm = () => {
    this.importModal.pop(true)
  }

  render() {
    const { disabledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath
          location="模板管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        {!this.state.inner && (
          <Reminder tips="基于桌面创建模板，通过模板批量分发和回收桌面，大量缩短桌面的上线时间，提高管理员的运维效率。"></Reminder>
        )}
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.importVm} type="primary">
                模板导入
              </Button>
              <Button
                onClick={() => this.delTem(this.tablex.getSelection())}
                disabled={disabledButton?.disabledDelete}
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
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={() => {
              this.onBack()
              this.tablex.refresh(this.state.tableCfg)
            }}
          />
          <DetailDrawer
            onRef={ref => {
              this.infoDrawer = ref
            }}
            onClose={this.onBack}
          />
          <ExportModal
            onRef={ref => {
              this.exportModal = ref
            }}
          ></ExportModal>
          <ImportModal
            onRef={ref => {
              this.importModal = ref
            }}
          ></ImportModal>
        </TableWrap>
      </React.Fragment>
    )
  }
}
