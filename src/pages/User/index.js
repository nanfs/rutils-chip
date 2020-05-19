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
import { adColumns } from './chip/AdTableCfg'
import AddDrawer from './chip/AddDrawer'
import DetailDrawer from './chip/DetailDrawer'
import EditDrawer from './chip/EditDrawer'
import SetRoloModal from './chip/SetRoloModal'
import userApi from '@/services/user'
import { checkAuth, checkAuthDiscrete } from '@/utils/checkPermissions'

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
        <a
          onClick={() =>
            checkAuth('admin') && this.detailUser(record.username, record)
          }
        >
          {record.lockStatus === 1 ? (
            <Icon
              type="lock"
              title="已锁定"
              style={{
                color: '#ff4d4f'
              }}
            />
          ) : (
            ''
          )}
          {record.username}
        </a>
      )
    }
  }

  options = {
    title: '操作',
    dataIndex: 'opration',
    width: 150,
    render: (text, record) => {
      const moreAction = (
        <Menu>
          <Menu.Item
            key="1"
            hidden={!checkAuth('admin')}
            disabled={
              record.tccount + record.vmcount > 0 ||
              record.roleTypeId.toString() !== '2'
            }
            onClick={() => {
              this.deleteUser([record.id])
            }}
          >
            删除
          </Menu.Item>
          <Menu.Item
            key="2"
            hidden={!checkAuth('security')}
            onClick={this.forbiddenUser.bind(this, [record.id])}
            disabled={record.status === 1}
          >
            禁用
          </Menu.Item>
          <Menu.Item
            key="3"
            hidden={!checkAuth('security')}
            onClick={this.enableUser.bind(this, [record.id])}
            disabled={record.status === 0}
          >
            启用
          </Menu.Item>
          <Menu.Item
            key="4"
            hidden={!checkAuth('admin')}
            onClick={this.unlockUser.bind(this, [record.id])}
            disabled={record.lockStatus === 0}
          >
            解锁
          </Menu.Item>
        </Menu>
      )

      const onlySecurityAction = (
        <Menu>
          <Menu.Item
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
        </Menu>
      )
      return (
        <span className="opration-btn">
          <a
            onClick={this.setRole.bind(this, record, record.name)}
            hidden={!checkAuth('security') || !checkAuthDiscrete()}
          >
            分配权限
          </a>
          <Dropdown overlay={onlySecurityAction} placement="bottomRight">
            <a hidden={!checkAuth('security') || !checkAuthDiscrete()}>
              更多
              <Icon type="down" />
            </a>
          </Dropdown>
          <a
            onClick={() => this.editUser(record, record.name)}
            hidden={!checkAuth('admin')}
          >
            编辑
          </a>
          <Dropdown overlay={moreAction} placement="bottomRight">
            <a hidden={!checkAuth('admin')}>
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
    width: 130,
    render: (text, record) => {
      return (
        <span className="opration-btn">
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

  adColumnsArr = [this.userName, ...adColumns, this.adOptions]

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

    this.setState({ disabledButton, selection, selectData })
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
        () => this.tablex.search(this.state.tableCfg)
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
  deleteUser = (id = undefined) => {
    const ids = id || this.tablex.getSelection()
    const self = this
    confirm({
      title: '确定删除所选数据?',
      onOk() {
        return new Promise(resolve => {
          userApi
            .deleteUser({ userId: ids[0], domain: self.state.selectedType })
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
              error.type === 'timeout' &&
                self.tablex.refresh(self.state.tableCfg)
              resolve()
              console.log(error)
            })
        })
      },
      onCancel() {}
    })
  }

  forbiddenUser = (id = undefined) => {
    const ids = id || this.tablex.getSelection()
    userApi
      .forbiddenUser({ userId: ids[0] })
      .then(res => {
        if (res.success) {
          notification.success({ message: '禁用成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '禁用失败')
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
          notification.success({ message: '启用成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '启用失败')
        }
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  unlockUser = (id = undefined) => {
    const ids = id || this.tablex.getSelection()
    userApi
      .unlockUser({ userId: ids[0] })
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

  setRole = (record, name) => {
    this.SetRoloModal.pop(record)
  }

  detailUser = (username, data) => {
    this.setState({ inner: username })
    this.detailDrawer.pop(data, this.state.selectedType)
    // this.detailDrawer.drawer.show()
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
                showRightClinkMenu={checkAuth('admin')}
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
                  {selectedType === 'internal' ? (
                    <Button
                      onClick={this.addUser}
                      type="primary"
                      hidden={checkAuth('admin')}
                    >
                      创建
                    </Button>
                  ) : (
                    ''
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
                stopAutoFetch={true}
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
              <SetRoloModal
                onRef={ref => {
                  this.SetRoloModal = ref
                }}
                onSuccess={this.onSuccess}
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
