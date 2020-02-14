import React from 'react'
import { Button, Row, Col } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft
} from '@/components/Tablex'
import Treex from '@/components/Treex'
import InnerPath from '@/components/InnerPath'
import { columns, apiMethod } from './chip/TableCfg'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import './index.scss'
import userApi from '@/services/user'

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

  onSelect = (value, node) => {
    console.log(value, node)
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col span={4}>
            <Treex apiMethod={userApi.list} onSelect={this.onSelect}></Treex>
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
