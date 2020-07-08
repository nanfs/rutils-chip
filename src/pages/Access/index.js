import React, { useState, useRef, useEffect } from 'react'
import { Button, message, Modal, notification } from 'antd'
import { Tablex, InnerPath } from '@/components'
import { wrapResponse } from '@/utils/tool'
import accessApi from '@/services/access'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import { columns, apiMethod } from './chip/TableCfg'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex
const Access = props => {
  const cloName = {
    title: () => <span title="名称">名称</span>,
    width: 250,
    dataIndex: 'name',
    ellipsis: true,
    sorter: true
  }

  const action = {
    title: '操作',
    dataIndex: 'opration',
    width: 120,
    render: (text, record) => {
      return (
        <span className="opration-btn">
          <a onClick={() => editAccess(record.name, record)}>编辑</a>
          <a
            onClick={() => {
              delAccess(record.id, '确定删除该条数据?')
            }}
            disabled={record.boundTcNum !== 0}
          >
            删除
          </a>
        </span>
      )
    }
  }

  const tableRef = useRef()

  const [tableCfg, setTableCfg] = useState(
    createTableCfg({
      columns: [cloName, ...columns, action],
      apiMethod
    })
  )

  const [disabled, setDisabled] = useState({})
  const [inner, setInner] = useState('')

  useEffect(() => {
    tableRef.current.search(tableCfg)
  }, [tableCfg])

  // 删除禁用 如果 有终端使用不能删除 建议放开 实现双向解绑
  const onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length === 0) {
      disabledButton = { ...disabledButton, disabledDelete: true }
    }
    selectData.forEach(function(v) {
      if (v.boundTcNum !== 0) {
        disabledButton = { ...disabledButton, disabledDelete: true }
      }
    })
    setDisabled({ disabledButton })
  }

  // 支持对名称进行排序
  const onTableChange = (page, filter, sorter) => {
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
    setTableCfg({ ...tableCfg, searchs: { ...tableCfg.searchs, ...searchs } })
    // () => this.tablex.search(this.state.tableCfg)
  }

  // 返回调用
  const onBack = () => {
    setInner()
    // this.currentDrawer.drawer.hide()
  }

  // 内页成功执行后调用
  const onSuccess = () => {
    this.onBack()
    // this.tablex.refresh(this.state.tableCfg)
  }

  const addAccess = () => {
    setInner('创建')
    // this.addDrawer.pop()
    // this.setState({ inner: '创建' }, this.addDrawer.pop())
    // this.currentDrawer = this.addDrawer
  }

  // 准入策略数据( 暂时没有通过单独接口调 直接通过列表取)
  const editAccess = (name, data) => {
    setInner(name)
    // this.editDrawer.pop(data)
    // this.setState({ inner: name }, this.editDrawer.pop(data))
    // this.currentDrawer = this.editDrawer
  }

  // 删除准入策略 可以通过工具条 和表单操作列传入操作 表单操作列传入为单个
  const delAccess = (id, title = '确定删除所选数据?') => {
    const ids = Array.isArray(id) ? [...id] : [id]
    confirm({
      title,
      onOk: () => {
        accessApi
          .del({ ids })
          .then(res =>
            wrapResponse(res).then(() => {
              notification.success({ message: '删除成功' })
              // this.tablex.refresh(tableCfg)
            })
          )
          .catch(error => {
            message.error(error.message || error)
          })
      },
      onCancel() {}
    })
  }

  return (
    <React.Fragment>
      <InnerPath location="准入控制" inner={inner} onBack={onBack} />
      <TableWrap>
        <ToolBar>
          <BarLeft>
            <Button onClick={addAccess} type="primary">
              创建
            </Button>
            <Button
              onClick={() => delAccess(tableRef.current.getSelection())}
              disabled={disabled?.disabledDelete}
            >
              删除
            </Button>
          </BarLeft>
        </ToolBar>
        <Tablex
          ref={tableRef}
          onSelectChange={onSelectChange}
          tableCfg={tableCfg}
          onChange={onTableChange}
        />
        <AddDrawer
          ref={addDrawer}
          onSuccess={this.onSuccess}
          onClose={this.onBack}
        />
        <EditDrawer
          ref={editDrawer}
          onClose={this.onBack}
          onSuccess={this.onSuccess}
        />
      </TableWrap>
    </React.Fragment>
  )
}

export default Access
