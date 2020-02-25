import React from 'react'
import { Button, Row, Col, notification, message } from 'antd'
import produce from 'immer'

import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import Treex from '@/components/Treex'
import InnerPath from '@/components/InnerPath'
import SelectSearch from '@/components/SelectSearch'

import { columns, apiMethod } from './chip/TableCfg'
import AddDrawer from './chip/AddDrawer'
import DetailDrawer from './chip/DetailDrawer'
import EditDrawer from './chip/EditDrawer'
import userApi from '@/services/user'

import './index.scss'
import { array, element } from 'prop-types'

const nodes = [
  {
    id: 'department1',
    key: 'department1',
    value: 'department1',
    title: '用户组',
    parentId: null
  },
  {
    id: 'department2',
    key: 'department2',
    value: 'department2',
    title: '成都研发中心',
    parentId: 'department1'
  },
  {
    id: 'department3',
    key: 'department3',
    value: 'department3',
    title: '北京研发中心',
    parentId: 'department1'
  },
  {
    id: 'department4',
    key: 'department4',
    value: 'department4',
    title: '前端组',
    parentId: 'department2'
  },
  {
    id: 'department5',
    key: 'department5',
    value: 'department5',
    title: 'java组',
    parentId: 'department2'
  },
  {
    id: 'department6',
    key: 'department6',
    value: 'department6',
    title: '前端组',
    parentId: 'department3'
  }
]

export default class User extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    }),
    innerPath: undefined,
    initValues: {},
    value: undefined,
    inputValue: 'asd',
    domainlist: []
  }

  componentDidMount = () => {
    userApi
      .domainlist()
      .then(res => {
        if (res.success) {
          // notification.success({ message: '查询域成功' })
          const domainlist = res.data.map(item => {
            const obj = {}
            obj.label = item
            obj.value = item
            return obj
          })

          this.setState({
            domainlist
          })
        } else {
          message.error(res.message || '查询域失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          ...searchs
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
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
    this.selectSearch.reset()
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          groupId: value[0]
        }
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
  }

  treeRenderSuccess = (selectNode, treeData) => {
    this.setState({
      treeData
    })
    this.setState(
      produce(draft => {
        draft.tableCfg = {
          ...draft.tableCfg,
          apiMethod,
          searchs: {
            ...draft.tableCfg.searchs,
            groupId: selectNode
          }
        }
        // draft.treeData = treeData
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  render() {
    const searchOptions = [{ label: '名称', value: 'name' }]
    const { inputValue, treeData, initValues, domainlist } = this.state
    return (
      <React.Fragment>
        <InnerPath
          location="用户管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <div className="user-wrap">
            <div className="user-tree">
              <Treex
                apiMethod={userApi.groupQuery}
                onSelect={this.onSelect}
                addNodeApiMethod={userApi.groupCreate}
                editNodeApiMethod={userApi.groupUpdate}
                deleteNodeApiMethod={userApi.groupDelete}
                treeRenderSuccess={this.treeRenderSuccess}
              ></Treex>
            </div>
            <div className="user-table">
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
                <BarRight>
                  <SelectSearch
                    onRef={ref => {
                      this.selectSearch = ref
                    }}
                    options={searchOptions}
                    onSearch={this.search}
                    inputValue={inputValue}
                  ></SelectSearch>
                </BarRight>
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
                onClose={this.onBack}
                onSuccess={this.onSuccesss}
                nodeData={treeData}
                domainlist={domainlist}
              />
              <EditDrawer
                onRef={ref => {
                  this.editDrawer = ref
                }}
                onClose={this.onBack}
                onSuccess={this.onSuccess}
                initValues={initValues}
                nodeData={treeData}
                domainlist={domainlist}
              />
              <DetailDrawer
                onRef={ref => {
                  this.detailDrawer = ref
                }}
                onClose={this.onBack}
                initValues={initValues}
              />
            </div>
          </div>
        </TableWrap>
      </React.Fragment>
    )
  }
}
