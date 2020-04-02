import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import { Tablex, InnerPath } from '@/components'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import accessApi from '@/services/access'
import DetailDrawer from './chip/DetailDrawer'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
export default class Access extends React.Component {
  accessName = {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true
  }

  action = {
    title: '操作',
    dataIndex: 'opration',
    width: 130,
    render: (text, record) => {
      return (
        <span className="opration-btn">
          <a onClick={() => this.editAccess(record.name, record)}>编辑</a>
          <a
            onClick={() => {
              this.delAccess(record.id, '确定删除该条数据?')
            }}
          >
            删除
          </a>
        </span>
      )
    }
  }

  columnsArr = [this.accessName, ...columns, this.action]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    })
  }

  /**
   *
   *
   * @param {*} selection
   * @param {*} selectData
   * 删除禁用 如果 有终端使用不能删除 建议放开 实现双向解绑
   */
  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length === 0) {
      disabledButton = { ...disabledButton, disabledDelete: true }
    }
    selectData.forEach(function(v) {
      if (v.boundTcNum !== 0) {
        disabledButton = { ...disabledButton, disabledDelete: true }
      }
    })
    this.setState({ disabledButton })
  }

  /**
   *
   *
   * @memberof Access
   * 创建转入策略
   */
  addAccess = () => {
    this.setState({ inner: '创建' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  /**
   *
   *
   * @memberof Access
   * @param name 准入名称
   * @param data 准入策略数据( 暂时没有通过单独接口调 直接通过列表取)
   */
  editAccess = (name, data) => {
    this.setState({ inner: name }, this.editDrawer.pop(data))
    this.currentDrawer = this.editDrawer
  }

  /**
   *
   *
   * @param {*} id
   * @param {string} [title='确定删除所选数据?']
   * @returns
   * 删除准入策略 可以通过工具条 和表单操作列传入操作 表单操作列传入为单个
   * 调用都是批量删除接口
   */
  delAccess = (id, title = '确定删除所选数据?') => {
    const ids = Array.isArray(id) ? id : [id]
    const self = this
    confirm({
      title,
      onOk() {
        return new Promise(resolve => {
          accessApi
            .del({ ids })
            .then(res => {
              if (res.success) {
                notification.success({ message: '删除成功' })
                self.onSuccess()
              } else {
                message.error(res.message || '删除失败')
              }
              resolve()
            })
            .catch(error => {
              message.error(error.message || error)
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
   * @memberof Access
   * 返回后 将inner path 置为空
   */
  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  /**
   *
   *
   * @memberof Access
   * 成功后删除刷新表格
   */
  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.currentDrawer.drawer.hide()
    this.setState({ inner: undefined })
  }

  render() {
    const { disabledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath
          location="准入控制"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.addAccess}>创建</Button>
              <Button
                onClick={() => this.delAccess(this.tablex.getSelection())}
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
            onSelectChange={this.onSelectChange}
            tableCfg={this.state.tableCfg}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
          />
          <DetailDrawer
            onRef={ref => {
              this.detailDrawer = ref
            }}
            onClose={this.onBack}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
