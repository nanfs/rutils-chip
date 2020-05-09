import React from 'react'
import { Button, message, Modal, notification } from 'antd'
import { Tablex, InnerPath } from '@/components'
import EditDrawer from './chip/EditDrawer'
import AddDrawer from './chip/AddDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import deviceApi from '@/services/device'
import { Auth } from '@/components/Authorized'

import produce from 'immer'
import { checkAuth } from '@/utils/checkPermissions'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex

export default class Device extends React.Component {
  Name = {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'name',
    width: 250,
    ellipsis: true,
    sorter: true
  }

  action = {
    title: () => <span title="操作">操作</span>,
    dataIndex: 'opration',
    width: 120,
    render: (text, record) => {
      return (
        <span className="opration-btn">
          <Auth role="admin">
            <a onClick={() => this.editDev(record, record.name)}>编辑</a>
          </Auth>
          <Auth role="admin">
            <a onClick={() => this.delDev(record.id)}>删除</a>
          </Auth>
        </span>
      )
    }
  }

  columnsArr = checkAuth('admin')
    ? [this.Name, ...columns, this.action]
    : [this.Name, ...columns]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      expandedRowRender: false,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    })
  }

  /**
   *
   *
   * @param {*} selection
   * 删除禁用
   */
  onSelectChange = selection => {
    let disabledButton = {}
    if (selection.length === 0) {
      disabledButton = { ...disabledButton, disabledDelete: true }
    }
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

  /**
   *
   *
   * @memberof Device
   * 返回后 将inner path 置为空
   */
  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  /**
   *
   *
   * @memberof Device
   * 成功后刷新表格
   */
  onSuccess = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
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
      onOk() {
        return new Promise(resolve => {
          deviceApi
            .delDev({ ids })
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
              console.log(error)
              resolve()
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
          location="外设控制"
          inner={this.state?.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Auth role="admin">
                <Button onClick={this.addDev} type="primary">
                  创建
                </Button>
              </Auth>
              <Auth role="admin">
                <Button
                  onClick={() => this.delDev(this.tablex.getSelection())}
                  disabled={disabledButton?.disabledDelete}
                >
                  删除
                </Button>
              </Auth>
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
