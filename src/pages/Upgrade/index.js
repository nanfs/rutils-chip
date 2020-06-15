import React from 'react'
import { Button, message, notification, Icon, Modal } from 'antd'
import produce from 'immer'

import { Tablex, InnerPath, SelectSearch } from '@/components'
import upgradeApi from '@/services/upgrade'
import { wrapResponse } from '@/utils/tool'

import { columns, apiMethod } from './chip/TableCfg'
import AddDrawer from './chip/AddDrawer'
import './index.less'

const { confirm } = Modal
const { createTableCfg, TableWrap, ToolBar, BarLeft, BarRight } = Tablex
export default class Upgrade extends React.Component {
  upgradeName = {
    title: () => <span title="升级包名称">升级包名称</span>,
    dataIndex: 'name',
    ellipsis: true
    /* render: (text, record) => {
      return (
        <a
        className="detail-link"
        onClick={() => this.detailUpgrade(record.name, record.sn)}
        >
          {record.name}
        </a>
      )
    } */
  }

  columnsArr = [this.upgradeName, ...columns]

  state = {
    tableCfg: createTableCfg({
      columns: this.columnsArr,
      apiMethod,
      paging: { size: 10 },
      pageSizeOptions: ['5', '10', '20', '50'],
      autoCallback: (selection, selectData) => {
        this.checkOptionsDisable(selection, selectData)
      }
    }),
    innerPath: undefined,
    // initValues: {},
    disabledButton: {}
  }

  // 表格行选中 根据选定数据判断按钮状态
  checkOptionsDisable = (selection, selectData) => {
    let disabledButton = {}
    if (selection.length === 0) {
      disabledButton = {
        ...disabledButton,
        disabledDelete: true
      }
    }
    this.setState({ disabledButton })
  }

  // 表格行选中
  onSelectChange = (selection, selectData) => {
    this.checkOptionsDisable(selection, selectData)
  }

  /**
   * 当搜索条件下来处理
   * @memberof Upgrade
   */
  onSearchSelectChange = oldKey => {
    const searchs = { ...this.state.tableCfg.searchs }
    delete searchs[oldKey]
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...searchs
        }
      })
    )
  }

  // 表格onChange的回调
  onTableChange = (a, filter) => {
    const statusList = []
    filter.status &&
      filter.status.forEach(function(v) {
        statusList.push(...v)
      })
    const isRegList = []
    filter.isReg &&
      filter.isReg.forEach(function(v) {
        isRegList.push(...v)
      })
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          ...draft.tableCfg.searchs,
          status: statusList,
          isReg: isRegList
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  // 列表搜索
  search = (key, value) => {
    const searchs = {}
    searchs[key] = value
    this.setState(
      produce(draft => {
        draft.tableCfg.searchs = {
          // ...draft.tableCfg.searchs,
          status: draft.tableCfg.searchs.status,
          isReg: draft.tableCfg.searchs.isReg,
          ...searchs
        }
      }),
      () => this.tablex.search(this.state.tableCfg)
    )
  }

  // 新增、编辑成功后回调
  onSuccess = () => {
    this.tablex.refresh(this.state.tableCfg)
    this.setState({ inner: undefined })
  }

  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  // 创建升级包
  addUpgrade = () => {
    this.setState({ inner: '上传升级包' }, this.addDrawer.pop())
    this.currentDrawer = this.addDrawer
  }

  // 删除升级包
  deleteUpgrade = (id, title = '确定删除所选数据?') => {
    const ids = Array.isArray(id) ? [...id] : [id]
    const self = this
    confirm({
      title,
      onOk() {
        upgradeApi.deleteUpgrade({ ids }).then(res =>
          wrapResponse(res)
            .then(() => {
              notification.success({ message: '删除成功' })
              self.tablex.refresh(self.state.tableCfg)
            })
            .catch(error => {
              message.error(error.message || error || '删除失败')
              error.type === 'timeout' &&
                self.tablex.refresh(self.state.tableCfg)
              console.log(error)
            })
        )
      },
      onCancel() {}
    })
  }

  render() {
    const { disabledButton } = this.state
    return (
      <React.Fragment>
        <InnerPath
          location="升级包管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button onClick={() => this.addUpgrade()} type="primary">
                上传
              </Button>
              <Button
                onClick={() => this.deleteUpgrade(this.tablex.getSelection())}
                disabled={disabledButton.disabledDelete}
              >
                删除
              </Button>
            </BarLeft>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
            onSelectChange={this.onSelectChange}
            onChange={this.onTableChange}
          />
          <AddDrawer
            onRef={ref => {
              this.addDrawer = ref
            }}
            onSuccess={this.onSuccess}
            onClose={this.onBack}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
