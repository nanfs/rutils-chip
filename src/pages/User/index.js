import React from 'react'
import {
  Button,
  notification,
  message,
  Modal,
  Menu,
  Dropdown,
  Icon
} from 'antd'
import produce from 'immer'

import { Tablex, Treex, InnerPath, SelectSearch } from '@/components'

import { columns } from './chip/TableCfg'
import AddDrawer from './chip/AddDrawer'
import DetailDrawer from './chip/DetailDrawer'
import EditDrawer from './chip/EditDrawer'
import userApi from '@/services/user'

import './index.less'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex

export default class User extends React.Component {
  userName = {
    title: '用户名',
    dataIndex: 'name',
    ellipsis: true,
    render: (text, record) => {
      return (
        <a
          // className="detail-link"
          onClick={() => this.detailUser(record.username, record)}
        >
          {record.username}
        </a>
      )
    }
  }

  options = {
    title: '操作',
    dataIndex: 'opration',
    width: 130,
    render: (text, record) => {
      const moreAction = (
        <Menu>
          <Menu.Item
            key="1"
            disabled={record.tccount + record.vmcount > 0}
            onClick={() => {
              this.deleteUser([record.id])
            }}
          >
            删除
          </Menu.Item>
          <Menu.Item
            key="2"
            onClick={this.disableUser.bind(this, [record.id])}
            disabled={record.status === 1}
          >
            禁用
          </Menu.Item>
          <Menu.Item
            key="3"
            onClick={this.enableUser.bind(this, [record.id])}
            disabled={record.status === 0}
          >
            启用
          </Menu.Item>
        </Menu>
      )
      return (
        <span className="opration-btn">
          <a
            onClick={() => {
              this.setState({ inner: '编辑用户' })
              this.editUser(record)
              this.currentDrawer = this.editDrawer
            }}
          >
            编辑
          </a>

          <Dropdown overlay={moreAction} placement="bottomRight">
            <a>
              更多
              <Icon type="down" />
            </a>
          </Dropdown>
        </span>
      )
    }
  }

  columnsArr = [this.userName, ...columns, this.options]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod: userApi.queryByGroup,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined,
    initValues: {},
    value: undefined,
    domainlist: [],
    disabledButton: {},
    domainTreeData: undefined,
    groupTreeData: [],
    selectedType: 'internal'
  }

  componentDidMount = () => {
    userApi
      .domainlist()
      .then(res => {
        if (res.success) {
          // notification.success({ message: '查询域成功' })
          const domainlist = res.data.map(item => {
            const obj = {}
            obj.label = item === 'internal' ? '本地组' : item
            obj.value = item
            if (item !== 'internal') {
              this.setState({
                domainTreeData: [
                  {
                    key: item,
                    id: item,
                    value: item,
                    parentId: '-2',
                    title: item,
                    type: 'ad'
                  }
                ]
              })
            }
            return obj
          })

          this.setState({
            domainlist
          })
        } else {
          message.error(res.message || '查询域失败')
        }
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
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
    } else {
      selectData.forEach(item => {
        if (item.tccount + item.vmcount > 0) {
          disabledButton = {
            ...disabledButton,
            disabledDelete: true
          }
        }
        if (item.status === 1) {
          disabledButton = {
            ...disabledButton,
            disabledDisable: true
          }
        }
        if (item.status === 0) {
          disabledButton = {
            ...disabledButton,
            disabledEnable: true
          }
        }
      })
    }

    this.setState({ disabledButton, selection, selectData, selectSN })
  }

  onTableChange = (a, filter) => {
    console.log(filter)
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

  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    console.log(this.state.selectedType)
    if (this.state.selectedType === 'internal') {
      this.setState(
        produce(draft => {
          draft.tableCfg = {
            ...draft.tableCfg,
            apiMethod: userApi.queryByGroup,
            searchs: {
              // ...draft.tableCfg.searchs,
              groupId: draft.tableCfg.searchs.groupId,
              ...searchs
            }
          }
          draft.selectedType = 'internal'
        }),
        () => this.tablex.search(this.state.tableCfg)
      )
    } else {
      this.setState(
        produce(draft => {
          draft.tableCfg = {
            ...draft.tableCfg,
            apiMethod: userApi.queryByAD,
            searchs: {
              // ...draft.tableCfg.searchs,
              domain: draft.tableCfg.searchs.domain,
              ...searchs
            }
          }
          draft.selectedType = value
        }),
        () => this.tablex.search(this.state.tableCfg)
      )
    }
  }

  onSelect = (value, node) => {
    // this.selectSearch.reset()
    console.log(value)
    if (node.node.props.type === 'ad') {
      this.groupTreex.cleanSelected()
      this.setState(
        produce(draft => {
          draft.tableCfg = {
            ...draft.tableCfg,
            apiMethod: userApi.queryByAD,
            searchs: {
              ...draft.tableCfg.searchs,
              domain: value,
              groupId: '',
              userName: ''
            }
          }
          draft.selectedType = value
        }),
        () => this.tablex.search(this.state.tableCfg)
      )
    } else {
      this.ADdomainTreex.cleanSelected()
      this.setState(
        produce(draft => {
          draft.tableCfg = {
            ...draft.tableCfg,
            apiMethod: userApi.queryByGroup,
            searchs: {
              ...draft.tableCfg.searchs,
              groupId: value,
              domain: ''
            }
          }
          draft.selectedType = 'internal'
        }),
        () => this.tablex.search(this.state.tableCfg)
      )
    }
  }

  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  /**
   * @memberof User
   * @description 树渲染成功后回调，刷新用户列表
   * @param treeData 用户组数据，用于新增、编辑的用户组树形下拉列表
   * @author linghu
   */
  treeRenderSuccess = (selectNode, treeData) => {
    this.setState({
      groupTreeData: treeData
    })
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          groupId: selectNode
        }
        // draft.groupTreeData = groupTreeData
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

  editUser = record => {
    this.setState({ inner: '编辑用户' })
    this.editDrawer.pop(record, this.state.selectedType)
    // this.editDrawer.drawer.show()
    this.currentDrawer = this.editDrawer
  }

  /**
   * @memberof User
   * @todo 删除目前只做单个，后面加批量
   * @author linghu
   */
  deleteUser = (id = undefined) => {
    const ids = id || this.tablex.getSelection()
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
            .catch(error => {
              message.error(error.message || error)
              resolve()
              console.log(error)
            })
        })
      },
      onCancel() {}
    })
  }

  disableUser = (id = undefined) => {
    const ids = id || this.tablex.getSelection()
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
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  enableUser = (id = undefined) => {
    const ids = id || this.tablex.getSelection()
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
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  detailUser = (username, id) => {
    this.setState({ inner: username })
    this.detailDrawer.pop(id)
    // this.detailDrawer.drawer.show()
    this.currentDrawer = this.detailDrawer
  }

  render() {
    const searchOptions = [
      { label: '用户名', value: 'username' },
      { label: '姓名', value: 'name' }
    ]
    const {
      groupTreeData,
      initValues,
      domainlist,
      disabledButton,
      domainTreeData
    } = this.state
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
                treeData={domainTreeData}
                showSearch={false}
                defaultSelectRootNode={false}
              ></Treex>
            </div>
            <div className="user-table">
              <ToolBar>
                <BarLeft>
                  <Button onClick={this.addUser} type="primary">
                    创建
                  </Button>
                  {/* <Button
                    onClick={this.editUser}
                    disabled={disabledButton.disabledEdit}
                  >
                    编辑
                  </Button> */}
                  <Button
                    onClick={() => this.disableUser()}
                    disabled={disabledButton.disabledDisable}
                  >
                    禁用
                  </Button>
                  <Button
                    onClick={() => this.enableUser()}
                    disabled={disabledButton.disabledEnable}
                  >
                    启用
                  </Button>
                  <Button
                    onClick={() => this.deleteUser()}
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
                nodeData={groupTreeData}
                domainlist={domainlist}
              />
              <EditDrawer
                onRef={ref => {
                  this.editDrawer = ref
                }}
                onClose={this.onBack}
                onSuccess={this.onSuccess}
                initValues={initValues}
                nodeData={groupTreeData}
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
