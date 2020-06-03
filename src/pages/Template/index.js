import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import { Tablex, InnerPath } from '@/components'
import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import templateApi from '@/services/template'

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
    width: 120,
    render: (text, record) => {
      return (
        <span className="opration-btn">
          <a onClick={() => this.editTem(record.name, record)}>编辑</a>
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
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined
  }

  /**
   *
   *
   * @memberof Template
   * 返回后 将inner path 置为空
   */
  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  /**
   *
   *
   * @memberof Template
   * 成功后刷新表格
   */
  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  onSelectChange = (selection, selectData) => {
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

  /**
   * @memberof Template
   * 编辑模板
   */
  editTem = (name, data) => {
    this.setState({ inner: name }, this.editDrawer.pop(data))
    this.currentDrawer = this.editDrawer
  }

  /**
   * @memberof Template
   * 批量删除
   */
  delTem = (id, title = '确定删除所选数据?') => {
    const ids = Array.isArray(id) ? [...id] : [id]
    const self = this
    confirm({
      title,
      onOk() {
        return new Promise(resolve => {
          templateApi
            .delTem({ ids })
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
        <InnerPath
          location="模板管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
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
            autoReplace={true}
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
        </TableWrap>
      </React.Fragment>
    )
  }
}
