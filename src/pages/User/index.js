import React from 'react'
import { Button, message, notification, TreeSelect, Row, Col } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import InnerPath from '@/components/InnerPath'
import { columns, apiMethod } from './chip/TableCfg'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import './index.scss'
import userApi from '@/services/user'

const { TreeNode } = TreeSelect
export default class User extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    }),
    innerPath: undefined,
    initValues: {},
    value: undefined
  }

  sendOrder = (id, order) => {
    console.log('sendOrder', id, order)
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  addUser = () => {
    this.setState({ inner: '创建用户' })
    this.addDrawer.drawer.show()
    this.currentDrawer = this.addDrawer
  }

  editUser = () => {
    this.setState({ inner: '编辑用户', initValues: this.state.selectData[0] })
    this.editDrawer.drawer.show()
    this.currentDrawer = this.editDrawer
  }

  lockUser = () => {
    const ids = this.tablex.getSelection()
    userApi
      .lockUser({ ids })
      .then(res => {
        if (res.success) {
          notification.success({ title: '锁定成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '锁定失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  unlockUser = () => {
    const ids = this.tablex.getSelection()
    userApi
      .unlockUser({ ids })
      .then(res => {
        if (res.success) {
          notification.success({ title: '解锁成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '解锁失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  deleteUser = () => {
    const ids = this.tablex.getSelection()
    userApi
      .deleteUser({ ids })
      .then(res => {
        if (res.success) {
          notification.success({ title: '删除成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '删除失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  detailUser = () => {
    /* const ids = this.tablex.getSelection()
    userApi
      .terminalsdetail({ ids })
      .then(res => {
        if (res.success) {
          this.setState({ inner: '查看详情', initValues: res.data })
          userApi.terminalsusagedetail({ ids }).then(result => {
            if (result.success) {
              this.setState({ initChartValue: result.data.list })
              this.detailDrawer.drawer.show()
              this.currentDrawer = this.detailDrawer
            } else {
              message.error(res.message || '查询失败')
            }
          })
        } else {
          message.error(res.message || '查询失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      }) */
    this.setState({ inner: '查看详情', initValues: {} })
    this.detailDrawer.drawer.show()
    this.currentDrawer = this.detailDrawer
  }

  onChange = value => {
    console.log(value)
    this.setState({ value })
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col span={4}>
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={this.state.value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              treeDefaultExpandAll
              onChange={this.onChange}
            >
              <TreeNode value="parent 1" title="parent 1" key="0-1">
                <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                  <TreeNode value="leaf1" title="my leaf" key="random" />
                  <TreeNode value="leaf2" title="your leaf" key="random1" />
                </TreeNode>
                <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                  <TreeNode
                    value="sss"
                    title={<b style={{ color: '#08c' }}>sss</b>}
                    key="random3"
                  />
                </TreeNode>
              </TreeNode>
            </TreeSelect>
          </Col>
          <Col span={20}>
            <InnerPath
              location="用户管理"
              inner={this.state.inner}
              onBack={this.onBack}
            />
            <TableWrap>
              <ToolBar>
                <BarLeft>
                  <Button onClick={this.addUser}>创建用户</Button>
                  <Button
                    onClick={this.editUser}
                    disabled={
                      !this.state.selection || this.state.selection.length !== 1
                    }
                  >
                    编辑
                  </Button>
                  <Button
                    onClick={this.lockUser}
                    disabled={
                      !this.state.selection ||
                      this.state.selection.length !== 1 ||
                      (this.state.selection.length === 1 &&
                        this.state.selection[0].status === '锁定')
                    }
                  >
                    锁定
                  </Button>
                  <Button
                    onClick={this.unlockUser}
                    disabled={
                      !this.state.selection ||
                      this.state.selection.length !== 1 ||
                      (this.state.selection.length === 1 &&
                        this.state.selection[0].status === '正常')
                    }
                  >
                    解锁
                  </Button>
                  <Button
                    onClick={this.detailUser}
                    disabled={
                      !this.state.selection || this.state.selection.length !== 1
                    }
                  >
                    详情
                  </Button>
                  <Button
                    onClick={this.deleteUser}
                    disabled={
                      !this.state.selection || this.state.selection.length === 0
                    }
                  >
                    删除
                  </Button>
                </BarLeft>
              </ToolBar>
              <Tablex
                onRef={ref => {
                  this.tablex = ref
                }}
                className="no-select-bg"
                tableCfg={this.state.tableCfg}
                onSelectChange={(selection, selectData) => {
                  this.setState({ selection, selectData })
                }}
              />
              <AddDrawer
                onRef={ref => {
                  this.addDrawer = ref
                }}
              />
              <EditDrawer
                onRef={ref => {
                  this.editDrawer = ref
                }}
                initValues={this.state.initValues}
              />
              <DetailDrawer
                onRef={ref => {
                  this.detailDrawer = ref
                }}
                initValues={this.state.initValues}
              />
            </TableWrap>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
