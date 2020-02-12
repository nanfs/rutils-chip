import React from 'react'
import { Button, Dropdown, Menu, Icon, notification, message } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import AddDrawer from './chip/AddDrawer'
import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import SetUserDrawer from './chip/SetUserDrawer'
import InnerPath from '@/components/InnerPath'
import SelectSearch from '@/components/SelectSearch'
import produce from 'immer'
import desktopsApi from '@/services/desktops'

import { columns, apiMethod } from './chip/TableCfg'
import './index.scss'

export default class Desktop extends React.Component {
  constructor(props) {
    super(props)
    columns.push({
      title: '操作',
      dataIndex: 'opration',
      className: 'opration',
      render: (text, record) => (
        <div>
          <Button
            onClick={this.sendOrder.bind(this, record.id, 'turnOn')}
            icon="user"
          />
          <Button
            onClick={this.sendOrder.bind(this, record.id, 'turnOff')}
            icon="user"
          />
          <Button onClick={this.detailVm}>详情</Button>
        </div>
      )
    })
  }

  state = {
    tableCfg: createTableCfg({
      columns,
      apiMethod,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10']
    }),
    innerPath: undefined,
    initValues: {}
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  sendOrder = (id, order) => {
    let ids = []
    if (!Array.isArray(id)) {
      ids.push(id)
    } else {
      ids = [...id]
    }
    desktopsApi
      .sendOrder({ ids, order })
      .then(res => {
        if (res.success) {
          notification.success({ title: '操作成功' })
          this.tablex.refresh(this.state.tableCfg)
        } else {
          message.error(res.message || '操作失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  onSelectChange = (selection, selectData) => {
    this.setState({
      tableCfg: { ...this.state.tableCfg, selection, selectData }
    })
  }

  createVm = () => {
    this.setState({ inner: '新建桌面' }, this.addDrawer.drawer.show())
    this.currentDrawer = this.addDrawer
  }

  deleteVm = () => {
    const { selection: ids } = this.state.tableCfg
    desktopsApi
      .delete({ ids })
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

  editVm = () => {
    this.setState(
      { inner: '编辑桌面', initValues: this.state.selectData[0] },
      this.editDrawer.drawer.show()
    )
    this.currentDrawer = this.editDrawer
  }

  detailVm = () => {
    this.setState({ inner: '桌面详情' }, this.detailDrawer.drawer.show())
    this.currentDrawer = this.detailDrawer
  }

  setUser = () => {
    this.setState({ inner: '分配用户' }, this.setUserDrawer.drawer.show())
    this.currentDrawer = this.setUserDrawer
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

  render() {
    const searchOptions = [{ label: '名称', value: 'name' }]
    const moreButton = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={(a, b) => {
            console.log(a, b)
          }}
        >
          <Icon type="user" />
          断电
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="user" />
          编辑
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="user" />
          删除
        </Menu.Item>
      </Menu>
    )
    return (
      <React.Fragment>
        <InnerPath
          location="桌面管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={this.createVm}>创建桌面</Button>
              <Button
                disabled={
                  !this.state.tableCfg.selection ||
                  this.state.tableCfg.selection.length !== 1
                }
                onClick={this.editVm}
              >
                编辑桌面
              </Button>
              <Button onClick={this.setUser}>分配用户</Button>
              <Button onClick={this.deleteVm}>删除</Button>
              <Button onClick={this.turnOn}>开机</Button>
              <Button onClick={this.turnOff}>关机</Button>
              <Dropdown overlay={moreButton}>
                <Button>
                  更多操作 <Icon type="down" />
                </Button>
              </Dropdown>
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
          <SetUserDrawer
            onRef={ref => {
              this.setUserDrawer = ref
            }}
            selection={this.state.tableCfg.selection}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
