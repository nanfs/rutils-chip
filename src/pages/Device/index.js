import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import { Tablex, InnerPath, Reminder } from '@/components'
import deviceApi from '@/services/device'
import { wrapResponse } from '@/utils/tool'
import { columns, apiMethod } from './chip/TableCfg'
import EditDrawer from './chip/EditDrawer'
import AddDrawer from './chip/AddDrawer'
import produce from 'immer'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex

export default class Device extends React.Component {
  name = {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'name',
    width: 250,
    ellipsis: true,
    sorter: true
  }

  action = {
    title: () => <span title="操作">操作</span>,
    dataIndex: 'opration',
    className: 'opration-btn',
    width: 120,
    render: (text, record) => {
      return (
        <span>
          <a onClick={() => this.editDev(record, record.name)}>编辑</a>
          <a
            disabled={record.boundTcNum !== 0}
            onClick={() => this.delDev(record.id)}
          >
            删除
          </a>
        </span>
      )
    }
  }

  columnsArr = [this.name, ...columns, this.action]

  componentDidMount = () => {
    if (this.props.location?.search === '?openAdd') {
      this.addDev()
    }
  }

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      expandedRowRender: false,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    })
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

  // 返回后 将inner path 置为空
  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  // 成功后刷新表格
  onSuccess = () => {
    this.onBack()
    this.tablex.refresh(this.state.tableCfg)
  }

  /**
   *
   *
   * @memberof Device
   * 创建外设策略
   */
  addDev = () => {
    this.setState({ inner: '创建' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  /**
   * @memberof Device
   * @param record 准入外设策略( 暂时没有通过单独接口调 直接通过列表取)
   */
  editDev = (record, name) => {
    let selectDev = {}
    selectDev = record
    const initKeys = []
    selectDev.usbs.forEach(function(v, i) {
      initKeys.push(i)
    })
    if (initKeys.length) {
      selectDev.initKeys = initKeys
    } else {
      selectDev.initKeys = [0]
    }
    this.setState({ inner: name }, this.editDrawer.pop(selectDev))
    this.currentDrawer = this.editDrawer
  }

  /**
   *
   *
   * @param {*} id
   * @param {string} [title='确定删除所选数据?']
   * @returns
   * 删除外设策略 可以通过工具条 和表单操作列传入操作 表单操作列传入为单个
   * 调用都是批量删除接口
   */
  delDev = (id, title = '确定删除所选数据?') => {
    const ids = Array.isArray(id) ? [...id] : [id]
    const self = this
    confirm({
      title,
      onOk: () => {
        deviceApi
          .delDev({ ids })
          .then(res =>
            wrapResponse(res).then(() => {
              notification.success({ message: '删除成功' })
              this.tablex.refresh(this.state.tableCfg)
            })
          )
          .catch(error => {
            error.type === 'timeout' && self.tablex.refresh(self.state.tableCfg)
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
          location="外设控制"
          inner={this.state?.inner}
          onBack={this.onBack}
        >
          {!this.state?.inner && (
            <Reminder
              tips={
                <div>
                  <p>
                    外设控制用于管理外设设备是否允许连入终端，可以在终端管理中可以对终端设置外设控制。
                  </p>
                  <p>
                    白名单中的外设设备允许连入终端，黑名单中的外设设备禁止连入终端。
                  </p>
                </div>
              }
            ></Reminder>
          )}
        </InnerPath>
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.addDev} type="primary">
                创建
              </Button>
              <Button
                onClick={() => this.delDev(this.tablex.getSelection())}
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
            onChange={this.onTableChange}
          />
          <EditDrawer
            onRef={ref => {
              this.editDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
