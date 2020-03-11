import React from 'react'
import { Button, notification, message, Modal } from 'antd'
import produce from 'immer'

import { Tablex, Treex, InnerPath, SelectSearch } from '@/components'

import { columns, apiMethod } from './chip/TableCfg'
import AddDrawer from './chip/AddDrawer'
import DetailDrawer from './chip/DetailDrawer'
import EditDrawer from './chip/EditDrawer'
import userApi from '@/services/user'

import './index.less'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
/* const nodes = [
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
] */

export default class User extends React.Component {
  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined,
    initValues: {},
    value: undefined,
    domainlist: [],
    disabledButton: {}
  }

  componentDidMount = () => {
    userApi
      .domainlist()
      .then(res => {
        if (res.success) {
          // notification.success({ message: '查询域成功' })
          const domainlist = res.data.map(item => {
            const obj = {}
            obj.label = item === 'internal' ? '本地组' : '域'
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
        message.error(errors)
        console.log(errors)
      })
  }

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          // ...draft.tableCfg.searchs,
          status: draft.tableCfg.searchs.status,
          groupId: draft.tableCfg.searchs.groupId,
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
    this.addDrawer.pop()
    this.currentDrawer = this.addDrawer
  }

  editUser = () => {
    this.setState({ inner: '编辑用户' })
    this.editDrawer.pop(this.state.selectData[0])
    // this.editDrawer.drawer.show()
    this.currentDrawer = this.editDrawer
  }

  // 删除目前只做单个，后面加批量
  deleteUser = () => {
    const ids = this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise((resolve, reject) => {
          userApi
            .deleteUser({ userId: ids[0] })
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
              resolve()
              console.log(errors)
            })
        })
      },
      onCancel() {}
    })
  }

  disableUser = () => {
    const ids = this.tablex.getSelection()
    userApi
      .disableUser({ userId: ids[0] })
      .then(res => {
        if (res.success) {
          notification.success({ message: '锁定成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '锁定失败')
        }
      })
      .catch(errors => {
        message.error(errors)
        console.log(errors)
      })
  }

  enableUser = () => {
    const ids = this.tablex.getSelection()
    userApi
      .enableUser({ userId: ids[0] })
      .then(res => {
        if (res.success) {
          notification.success({ message: '解锁成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '解锁失败')
        }
      })
      .catch(errors => {
        message.error(errors)
        console.log(errors)
      })
  }

  detailUser = () => {
    this.setState({ inner: '详情' })
    this.detailDrawer.pop(this.state.selectData[0])
    // this.detailDrawer.drawer.show()
    this.currentDrawer = this.detailDrawer
  }

  onSelect = (value, node) => {
    // this.selectSearch.reset()
    if (node.node.props.type === 'ad') {
      this.groupTreex.cleanSelected()
    } else {
      this.ADdomainTreex.cleanSelected()
    }
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          groupId: value[0]
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  treeRenderSuccess = (selectNode, treeData) => {
    this.setState({
      treeData
    })
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          groupId: selectNode
        }
        // draft.treeData = treeData
      }),
      () => this.tablex.refresh(this.state.tableCfg)
    )
  }

  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    const selectSN = selectData.map(item => item.sn)
    if (selection.length !== 1) {
      disabledButton = {
        ...disabledButton,
        disabledEdit: true,
        disabledDelete: true, // 删除目前只做单个，后面加批量
        disabledEnable: true, // 解锁目前只做单个，后面加批量
        disabledDisable: true // // 锁定目前只做单个，后面加批量
      }
    }
    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true,
        disabledEnable: true,
        disabledDisable: true
      }
    }
    const isBoundData = selectData.filter(
      item => item.tccount + item.vmcount > 0
    )
    if (isBoundData && isBoundData.length > 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true
      }
    }

    const disabledData = selectData.filter(item => item.status === 1)
    if (disabledData && disabledData.length > 0) {
      disabledButton = {
        ...disabledButton,
        disabledDisable: true
      }
    }

    const enabledData = selectData.filter(item => item.status === 0)
    if (enabledData && enabledData.length > 0) {
      disabledButton = {
        ...disabledButton,
        disabledEnable: true
      }
    }

    this.setState({ disabledButton, selection, selectData, selectSN })
  }

  onTableChange = (a, filter) => {
    console.log(filter)
    const status = ''

    /* filter.status.forEach(function(v, i) {
        status.push(...v)
      }) */
    filter.status &&
      this.setState(
        produce(draft => {
          draft.tableCfg.searchs = {
            ...draft.tableCfg.searchs,
            groupId: draft.tableCfg.searchs.groupId,
            status: filter.status.length > 1 ? '' : filter.status[0]
            // ...filter
          }
        }),
        () => this.tablex.refresh(this.state.tableCfg)
      )
  }

  render() {
    const searchOptions = [
      { label: '用户名', value: 'username' },
      { label: '姓名', value: 'name' }
    ]
    const { treeData, initValues, domainlist, disabledButton } = this.state
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
                onRef={ref => {
                  this.groupTreex = ref
                }}
                apiMethod={userApi.groupQuery}
                onSelect={this.onSelect}
                addNodeApiMethod={userApi.groupCreate}
                editNodeApiMethod={userApi.groupUpdate}
                deleteNodeApiMethod={userApi.groupDelete}
                treeRenderSuccess={this.treeRenderSuccess}
                showRightClinkMenu={true}
                showSearch={false}
              ></Treex>
              <Treex
                onRef={ref => {
                  this.ADdomainTreex = ref
                }}
                onSelect={this.onSelect}
                apiMethod={userApi.groupQuery}
                showSearch={false}
                defaultSelectRootNode={false}
              ></Treex>
            </div>
            <div className="user-table">
              <ToolBar>
                <BarLeft>
                  <Button onClick={this.addUser}>创建</Button>
                  <Button
                    onClick={this.editUser}
                    disabled={disabledButton.disabledEdit}
                  >
                    编辑
                  </Button>
                  <Button
                    onClick={this.disableUser}
                    disabled={disabledButton.disabledDisable}
                  >
                    禁用
                  </Button>
                  <Button
                    onClick={this.enableUser}
                    disabled={disabledButton.disabledEnable}
                  >
                    启用
                  </Button>
                  <Button
                    onClick={this.detailUser}
                    disabled={disabledButton.disabledEdit}
                  >
                    详情
                  </Button>
                  <Button
                    onClick={this.deleteUser}
                    disabled={disabledButton.disabledDelete}
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
                  ></SelectSearch>
                </BarRight>
              </ToolBar>
              <Tablex
                onRef={ref => {
                  this.tablex = ref
                }}
                className="no-select-bg"
                tableCfg={this.state.tableCfg}
                onSelectChange={this.onSelectChange}
                onChange={this.onTableChange}
                stopAutoFetch={true}
              />
              <AddDrawer
                onRef={ref => {
                  this.addDrawer = ref
                }}
                onClose={this.onBack}
                onSuccess={this.onSuccess}
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
              />
            </div>
          </div>
        </TableWrap>
      </React.Fragment>
    )
  }
}
