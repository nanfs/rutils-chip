import React from 'react'
import { Button, notification, Modal, message } from 'antd'
import { Tablex, InnerPath, Reminder } from '@/components'
import { wrapResponse } from '@/utils/tool'
import poolsApi from '@/services/pools'
import AddDrawer from './chip/AddDrawer'
import DetailDrawer from './chip/DetailDrawer'
import EditDrawer from './chip/EditDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import { columns, apiMethod } from './chip/TableCfg'
import './index.less'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex

export default class Pool extends React.Component {
  poolName = {
    title: () => <span title="名称">名称</span>,
    ellipsis: true,
    dataIndex: 'name',
    render: (text, record) => {
      return (
        <a
          className="detail-link"
          onClick={() => this.detailPool(record.id, record.name)}
        >
          {record.name}
        </a>
      )
    }
  }

  action = {
    title: '操作',
    width: 180,
    dataIndex: 'action',
    className: 'opration-btn',
    render: (text, record) => {
      return (
        <span>
          <a onClick={() => this.editPool(record.id, record.name)}>编辑</a>
          <a onClick={() => this.setUser(record.id, record.name)}>分配用户</a>
          <a onClick={() => this.deletePool(record.id, '确定删除本条数据?')}>
            删除
          </a>
        </span>
      )
    }
  }

  columnsArr = [this.poolName, ...columns, this.action]

  componentDidMount = () => {
    if (this.props.location?.search === '?openAdd') {
      this.createPool()
    }
  }

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      hasRowSelection: false, // 桌面池没有 多选框
      autoReplace: true
    }),
    innerPath: undefined,
    disabledButton: {}
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  onSuccess = () => {
    this.onBack()
    this.tablex.refresh(this.state.tableCfg)
  }

  // 桌面池分配用户 不支持批量
  setUser = (poolId, name) => {
    this.setState({ inner: name || '分配用户' }, this.setUserDrawer.pop(poolId))
    this.currentDrawer = this.setUserDrawer
  }

  // 桌面池管理
  detailPool = (poolId, name) => {
    this.setState({ inner: name }, this.detailDrawer.pop(poolId))
    this.currentDrawer = this.detailDrawer
  }

  // 创建桌面池
  createPool = () => {
    this.setState({ inner: '新建池' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  // 删除桌面池 不支持批量
  deletePool = (poolId, title = '确定删除所选数据?') => {
    confirm({
      title,
      onOk: () => {
        poolsApi
          .delPool(poolId)
          .then(res =>
            wrapResponse(res).then(() => {
              notification.success({ message: '删除成功' })
              this.tablex.refresh(this.state.tableCfg)
            })
          )
          .catch(error => {
            this.tablex.refresh(this.state.tableCfg)
            message.error(error.message || error)
          })
      },
      onCancel() {}
    })
  }

  // 删除所有桌面后调用 重刷桌面池列表
  onDeleteAll = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
    this.tablex.refresh(this.state.tableCfg)
  }

  // 编辑池
  editPool = (poolId, name) => {
    this.setState({ inner: name }, this.editDrawer.pop(poolId))
    this.currentDrawer = this.editDrawer
  }

  render() {
    return (
      <React.Fragment>
        <InnerPath
          location="桌面池管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        {!this.state.inner && (
          <span style={{ marginBottom: '20px' }}>
            支持桌面的池模式，桌面池是一组可以被用户使用的、具有相同配置一类桌面。
          </span>
          // <Reminder tips="支持桌面的池模式，桌面池是一组可以被用户使用的、具有相同配置一类桌面。"></Reminder>
        )}
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.createPool} type="primary">
                创建
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
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
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
            onDeleteAll={this.onDeleteAll}
            onClose={this.onBack}
          />
          <SetUserDrawer
            onRef={ref => {
              this.setUserDrawer = ref
            }}
            onClose={this.onBack}
            onSuccess={this.onSuccess}
            selection={this.state.tableCfg.selection}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
