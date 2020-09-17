import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import produce from 'immer'
import { Tablex, InnerPath, Reminder } from '@/components'
import { wrapResponse } from '@/utils/tool'
import accessApi from '@/services/access'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import { columns, apiMethod } from './chip/TableCfg'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
export default class Access extends React.Component {
  name = {
    title: () => <span title="名称">名称</span>,
    width: 250,
    dataIndex: 'name',
    ellipsis: true,
    sorter: true
  }

  action = {
    title: '操作',
    dataIndex: 'opration',
    className: 'opration-btn',
    width: 120,
    render: (text, record) => {
      return (
        <span>
          <a onClick={() => this.editAccess(record.name, record)}>编辑</a>
          <a
            onClick={() => {
              this.delAccess(record.id, '确定删除该条数据?')
            }}
            disabled={record.boundTcNum !== 0}
          >
            删除
          </a>
        </span>
      )
    }
  }

  state = {
    tableCfg: createTableCfg({
      columns: [this.name, ...columns, this.action],
      apiMethod
    })
  }

  componentDidMount = () => {
    if (this.props.location?.search === '?openAdd') {
      this.addAccess()
    }
  }

  // 删除禁用 如果 有终端使用不能删除 建议放开 实现双向解绑
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

  // 支持对名称进行排序
  onTableChange = (page, filter, sorter) => {
    const searchs = {}
    const orderArr = {
      ascend: 'asc',
      descend: 'desc'
    }
    if (sorter) {
      const { order, field } = sorter
      searchs.sortKey = field || undefined
      searchs.sortValue = (order && orderArr[order]) || undefined
    }
    if (filter) {
      searchs.type = filter.type
    }
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...searchs
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  // 返回调用
  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  // 内页成功执行后调用
  onSuccess = () => {
    this.onBack()
    this.tablex.refresh(this.state.tableCfg)
  }

  addAccess = () => {
    this.setState({ inner: '创建' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  // 准入策略数据( 暂时没有通过单独接口调 直接通过列表取)
  editAccess = (name, data) => {
    this.setState({ inner: name }, this.editDrawer.pop(data))
    this.currentDrawer = this.editDrawer
  }

  // 删除准入策略 可以通过工具条 和表单操作列传入操作 表单操作列传入为单个
  delAccess = (id, title = '确定删除所选数据?') => {
    const ids = Array.isArray(id) ? [...id] : [id]
    confirm({
      title,
      onOk: () => {
        accessApi
          .del({ ids })
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
    const { disabledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath
          location="准入控制"
          inner={this.state.inner}
          onBack={this.onBack}
        >
          {!this.state?.inner && (
            <Reminder
              tips={
                <div>
                  <p>
                    准入控制用于配置终端的准入方式和准入时间，可以在终端管理中可以对终端设置准入控制。
                    <p></p>
                    如果一个终端设置了多个准入控制，准入时间取所有准入时间的并集。
                  </p>
                </div>
              }
            ></Reminder>
          )}
        </InnerPath>
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.addAccess} type="primary">
                创建
              </Button>
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
            onChange={this.onTableChange}
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
        </TableWrap>
      </React.Fragment>
    )
  }
}
