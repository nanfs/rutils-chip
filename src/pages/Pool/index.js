import React from 'react'
import { Button, notification, Modal, message } from 'antd'
import { Tablex, InnerPath } from '@/components'
import AddDrawer from './chip/AddDrawer'
import DetailDrawer from './chip/DetailDrawer'
import EditDrawer from './chip/EditDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import produce from 'immer'
import poolsApi from '@/services/pools'
import { columns, apiMethod } from './chip/TableCfg'
import './index.less'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft } = Tablex

export default class Pool extends React.Component {
  poolName = {
    title: '基本信息',
    dataIndex: 'name',
    render: (text, record) => {
      return (
        <a
          className="detail-link"
          onClick={() => this.detailPool(record.name, record.id)}
        >
          <span>{record.name}</span>
        </a>
      )
    }
  }

  columnsArr = [this.poolName, ...columns]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
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

  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length !== 1) {
      disabledButton = {
        ...disabledButton,
        disabledEdit: true,
        disabledDelete: true,
        disabledSetUser: true
      }
    }
    this.setState({ disabledButton })
  }

  detailPool = (name, id) => {
    this.setState({ inner: name }, this.detailDrawer.pop(id))
    this.currentDrawer = this.detailDrawer
  }

  createPool = () => {
    this.setState({ inner: '新建池' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  deletePool = () => {
    // TODO 添加删除禁用 只能单个删除
    const poolId = this.tablex.getSelection()[0]
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise((resolve, reject) => {
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
            .catch(errors => {
              message.error(errors)
              console.log(errors)
              resolve()
            })
        })
      },
      onCancel() {}
    })
  }

  editPool = () => {
    this.setState(
      { inner: '编辑池' },
      this.editDrawer.pop(this.tablex.getSelection()[0])
    )
    this.currentDrawer = this.editDrawer
  }

  setUser = () => {
    this.setState(
      { inner: '分配用户' },
      this.setUserDrawer.pop(this.tablex.getSelection()[0])
    )
    this.currentDrawer = this.setUserDrawer
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  render() {
    const { disabledButton } = this.state

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
              <Button onClick={this.createPool}>创建池</Button>
              <Button
                onClick={this.editPool}
                disabled={disabledButton.disabledEdit}
              >
                编辑池
              </Button>
              <Button
                onClick={this.setUser}
                disabled={disabledButton.disabledSetUser}
              >
                分配用户
              </Button>
              <Button
                onClick={this.deletePool}
                disabled={disabledButton.disabledDelete}
              >
                删除池
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
