import React from 'react'
import { Button, notification, Modal, message } from 'antd'
import { Tablex, InnerPath } from '@/components'
import { Auth } from '@/components/Authorized'
import AddDrawer from './chip/AddDrawer'
import DetailDrawer from './chip/DetailDrawer'
import EditDrawer from './chip/EditDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import poolsApi from '@/services/pools'
import { columns, apiMethod } from './chip/TableCfg'
// import { checkAuth } from '@/utils/checkPermissions'
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
    render: (text, record) => {
      return (
        <span className="opration-btn">
          <Auth role="admin">
            <a onClick={() => this.editPool(record.id, record.name)}>编辑</a>
          </Auth>

          <Auth role="security">
            <a onClick={() => this.setUser(record.id, record.name)}>分配用户</a>
          </Auth>
          <Auth role="admin">
            <a onClick={() => this.deletePool(record.id, '确定删除本条数据?')}>
              删除
            </a>
          </Auth>
        </span>
      )
    }
  }

  columnsArr = [this.poolName, ...columns, this.action]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      hasRowSelection: false, // 桌面池没有 多选框
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined,
    disabledButton: {}
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.currentDrawer.drawer.hide()
    this.setState({ inner: undefined })
  }

  /**
   *
   * 桌面池分配用户 不支持批量
   * @memberof Pool
   */
  setUser = (poolId, name) => {
    this.setState({ inner: name || '分配用户' }, this.setUserDrawer.pop(poolId))
    this.currentDrawer = this.setUserDrawer
  }

  /**
   *桌面池管理
   *
   * @memberof Pool
   */
  detailPool = (poolId, name) => {
    this.setState({ inner: name }, this.detailDrawer.pop(poolId))
    this.currentDrawer = this.detailDrawer
  }

  /**
   * 创建桌面池
   *
   * @memberof Pool
   */
  createPool = () => {
    this.setState({ inner: '新建池' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  /**
   *删除桌面池 不支持批量
   *
   * @memberof Pool
   */
  deletePool = (poolId, title = '确定删除所选数据?') => {
    const self = this
    confirm({
      title,
      onOk() {
        return new Promise(resolve => {
          poolsApi
            .delPool(poolId)
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
              self.tablex.refresh(self.state.tableCfg)
              console.log(error)
              resolve()
            })
        })
      },
      onCancel() {}
    })
  }

  /**
   * 删除所有桌面后调用 重刷
   *
   * @memberof Pool
   */
  onDeleteAll = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
    this.tablex.refresh(this.state.tableCfg)
  }

  /**
   *编辑池
   *
   * @memberof Pool
   */
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
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Auth role="admin">
                <Button onClick={this.createPool} type="primary">
                  创建
                </Button>
              </Auth>
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
