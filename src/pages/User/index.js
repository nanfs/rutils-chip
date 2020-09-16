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

import { Tablex, Treex, InnerPath, SelectSearch, Reminder } from '@/components'
import userApi from '@/services/user'
import { wrapResponse } from '@/utils/tool'

import { columns } from './chip/TableCfg'
import { adColumns } from './chip/AdTableCfg'
import AddDrawer from './chip/AddDrawer'
import DetailDrawer from './chip/DetailDrawer'
import EditDrawer from './chip/EditDrawer'

import './index.less'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex

export default class User extends React.Component {
  userName = {
    title: () => <span title="用户名">用户名</span>,
    dataIndex: 'name',
    ellipsis: true,
    render: (text, record) => {
      return (
        <a onClick={() => this.detailUser(record.username, record)}>
          {record.lockStatus === 1 && (
            <Icon
              type="lock"
              title="已锁定"
              style={{
                color: '#ff4d4f'
              }}
            />
          )}
          {record.username}
        </a>
      )
    }
  }

  options = {
    title: '操作',
    dataIndex: 'opration',
    className: 'opration-btn',
    width: 140,
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
            onClick={this.forbiddenUser.bind(this, [record.id])}
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
          <Menu.Item
            key="4"
            onClick={this.unlockUser.bind(this, [record.id])}
            disabled={record.lockStatus === 0}
          >
            解锁
          </Menu.Item>
        </Menu>
      )

      return (
        <span>
          <a onClick={() => this.editUser(record, record.name)}>编辑</a>
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

  adOptions = {
    title: '操作',
    dataIndex: 'opration',
    className: 'opration-btn',
    width: 110,
    render: (text, record) => {
      return (
        <span>
          <a
            onClick={() => {
              this.deleteUser([record.id])
            }}
          >
            删除
          </a>
        </span>
      )
    }
  }

  columnsArr = [this.userName, ...columns, this.options]

  // AD域显示表格
  adColumnsArr = [this.userName, ...adColumns, this.adOptions]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod: userApi.queryByGroup,
      paging: { size: 10 },
      autoFetch: false,
      pageSizeOptions: ['5', '10', '20', '50']
    }),
    innerPath: undefined,
    initValues: {},
    value: undefined,
    domainlist: [],
    disabledButton: {},
    groupTreeData: [],
    selectedType: 'internal'
  }

  componentDidMount = () => {
    userApi.domainlist().then(res => {
      wrapResponse(res)
        .then(() => {
          const domainlist = res.data.map(item => {
            const obj = {}
            obj.label = item === 'internal' ? '本地组(internal)' : item
            obj.value = item
            obj.id = item
            obj.title = item
            obj.parentId = item === 'internal' ? '-1' : '-2'
            obj.type = item === 'internal' ? 'internal' : 'ad'
            return obj
          })

          this.setState({
            domainlist
          })
          if (this.props.location?.search === '?openAdd') {
            this.addUser()
          }
        })
        .catch(error => message.error(error.message || error || '查询域失败'))
    })
  }

  // 表格行选中 根据选定数据判断按钮状态
  onSelectChange = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length !== 1) {
      disabledButton = {
        ...disabledButton,
        disabledEdit: true,
        disabledDelete: true, // 删除目前只做单个，后面加批量
        disabledEnable: true, // 解锁目前只做单个，后面加批量
        disabledDisable: true, //  锁定目前只做单个，后面加批量
        disabledUnlock: true
      }
    }
    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true,
        disabledEnable: true,
        disabledDisable: true,
        disabledUnlock: true
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
        if (item.lockStatus === 0) {
          disabledButton = {
            ...disabledButton,
            disabledUnlock: true
          }
        }
      })
    }

    this.setState({ disabledButton })
  }

  // 表格onChange的回调
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
        () => this.tablex.search(this.state.tableCfg)
      )
  }

  // 列表搜索
  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
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
            apiMethod: userApi.queryByAd,
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
    if (node.node.props.type === 'ad') {
      this.groupTreex.cleanSelected()
      this.state.domainlist.forEach((item, index) => {
        if (item.value !== 'internal') {
          this[`ADdomainTreex${index}`].cleanSelected()
        }
      })
      this.setState(
        produce(draft => {
          draft.tableCfg = {
            ...draft.tableCfg,
            apiMethod: userApi.queryByAd,
            columns: this.adColumnsArr,
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
      this.state.domainlist.forEach((item, index) => {
        if (item.value !== 'internal') {
          this[`ADdomainTreex${index}`].cleanSelected()
        }
      })
      this.setState(
        produce(draft => {
          draft.tableCfg = {
            ...draft.tableCfg,
            apiMethod: userApi.queryByGroup,
            columns: this.columnsArr,
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

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  // 创建用户
  addUser = () => {
    this.setState({ inner: '创建用户' })
    this.addDrawer.pop()
    this.currentDrawer = this.addDrawer
  }

  // 编辑用户
  editUser = (record, name) => {
    this.setState(
      { inner: name },
      this.editDrawer.pop(record, this.state.selectedType)
    )
    this.currentDrawer = this.editDrawer
  }

  /**
   * @memberof User
   * @todo 删除目前只做单个，后面加批量
   * @author linghu
   */
  deleteUser = id => {
    const ids = id || this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        userApi
          .deleteUser({ userId: ids[0], domain: self.state.selectedType })
          .then(res => {
            wrapResponse(res)
              .then(() => {
                notification.success({ message: '删除成功' })
                self.tablex.refresh(self.state.tableCfg)
              })
              .catch(error => {
                message.error(error.message || error)
                error.type === 'timeout' &&
                  self.tablex.refresh(self.state.tableCfg)
                console.log(error)
              })
          })
      },
      onCancel() {}
    })
  }

  // 禁用用户
  forbiddenUser = (id = undefined) => {
    const ids = id || this.tablex.getSelection()
    userApi.forbiddenUser({ userId: ids[0] }).then(res => {
      wrapResponse(res)
        .then(() => {
          notification.success({ message: '禁用成功' })
          this.tablex.refresh(this.state.tableCfg)
        })
        .catch(error => message.error(error.message || error || '禁用失败'))
    })
  }

  // 启用用户
  enableUser = (id = undefined) => {
    const ids = id || this.tablex.getSelection()
    userApi.enableUser({ userId: ids[0] }).then(res => {
      wrapResponse(res)
        .then(() => {
          notification.success({ message: '启用成功' })
          this.tablex.refresh(this.state.tableCfg)
        })
        .catch(error => message.error(error.message || error || '启用失败'))
    })
  }

  // 解锁用户
  unlockUser = (id = undefined) => {
    const ids = id || this.tablex.getSelection()
    userApi.unlockUser({ userId: ids[0] }).then(res => {
      wrapResponse(res)
        .then(() => {
          notification.success({ message: '解锁成功' })
          this.tablex.refresh(this.state.tableCfg)
        })
        .catch(error => message.error(error.message || error || '解锁失败'))
    })
  }

  // 用户详情
  detailUser = (username, data) => {
    this.setState({ inner: username })
    this.detailDrawer.pop(data, this?.state.selectedType)
    this.currentDrawer = this.detailDrawer
  }

  render() {
    const searchOptions = [
      { label: '用户名', value: 'username' },
      { label: '姓名', value: 'name' }
    ]
    const { groupTreeData, initValues, domainlist, selectedType } = this.state
    return (
      <React.Fragment>
        <InnerPath
          location="用户管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        {!this.state.inner && (
          <Reminder tips="平台内置用户管理模块，支持对本地组（internal）用户进行创建、编辑、删除等操作，支持对已分配桌面或终端AD域用户进行查看、删除等操作。"></Reminder>
        )}
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
              {domainlist &&
                domainlist.map((item, index) =>
                  item.type !== 'internal' ? (
                    <Treex
                      key={index}
                      onRef={ref => {
                        this[`ADdomainTreex${index}`] = ref
                      }}
                      onSelect={this.onSelect}
                      treeData={[item]}
                      showSearch={false}
                      defaultSelectRootNode={false}
                    ></Treex>
                  ) : (
                    ''
                  )
                )}
            </div>
            <div className="user-table">
              <ToolBar>
                <BarLeft>
                  {selectedType === 'internal' && (
                    <Button onClick={this.addUser} type="primary">
                      创建
                    </Button>
                  )}
                </BarLeft>
                <BarRight>
                  <SelectSearch
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
              />
              <AddDrawer
                onRef={ref => {
                  this.addDrawer = ref
                }}
                onClose={this.onBack}
                onSuccess={this.onSuccess}
                nodeData={groupTreeData}
                domainlist={[{ value: 'internal', label: '本地组(internal)' }]}
              />
              <EditDrawer
                onRef={ref => {
                  this.editDrawer = ref
                }}
                onClose={this.onBack}
                onSuccess={this.onSuccess}
                initValues={initValues}
                nodeData={groupTreeData}
                domainlist={[{ value: 'internal', label: '本地组(internal)' }]}
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
