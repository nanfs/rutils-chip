import React from 'react'
import { Button, message, notification } from 'antd'
import Tablex, {
  createTableCfg,
  TableWrap,
  ToolBar,
  BarLeft,
  BarRight
} from '@/components/Tablex'
import EditDrawer from './chip/EditDrawer'
import DetailDrawer from './chip/DetailDrawer'
import InnerPath from '@/components/InnerPath'
import { columns, apiMethod } from './chip/TableCfg'
import './index.scss'
import terminalApi from '@/services/terminal'

export default class Termina extends React.Component {
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

  editTerminal = () => {
    this.setState(
      { inner: '编辑终端', initValues: this.state.selectData[0] },
      this.editDrawer.drawer.show()
    )
    this.currentDrawer = this.editDrawer
  }

  detailTerminal = () => {
    const ids = this.tablex.getSelection()
    terminalApi
      .terminalsdetail({ ids })
      .then(res => {
        if (res.success) {
          this.setState({ inner: '查看详情', initValues: res.data })
          terminalApi.terminalsusagedetail({ ids }).then(result => {
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
      })
  }

  onTerminal = () => {
    const ids = this.tablex.getSelection()
    if (ids.length > 0) {
      terminalApi
        .onTerminal({ ids })
        .then(res => {
          if (res.success) {
            notification.success({ title: '开机成功' })
            this.tablex.refresh(this.state.tableCfg)
          } else {
            message.error(res.message || '开机失败')
          }
        })
        .catch(errors => {
          console.log(errors)
        })
    } else {
      message.warning('请选择要开机的终端！')
    }
  }

  offTerminal = () => {
    const ids = this.tablex.getSelection()
    if (ids.length > 0) {
      terminalApi
        .onTerminal({ ids })
        .then(res => {
          if (res.success) {
            notification.success({ title: '关机成功' })
            this.tablex.refresh(this.state.tableCfg)
          } else {
            message.error(res.message || '关机失败')
          }
        })
        .catch(errors => {
          console.log(errors)
        })
    } else {
      message.warning('请选择要关机的终端！')
    }
  }

  admitAccessTerminal = () => {
    const ids = this.tablex.getSelection()
    if (ids.length > 0) {
      terminalApi
        .onTerminal({ ids })
        .then(res => {
          if (res.success) {
            notification.success({ title: '接入成功' })
            this.tablex.refresh(this.state.tableCfg)
          } else {
            message.error(res.message || '接入失败')
          }
        })
        .catch(errors => {
          console.log(errors)
        })
    } else {
      message.warning('请选择允许接入的终端！')
    }
  }

  render() {
    return (
      <React.Fragment>
        <InnerPath
          location="终端管理"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          <ToolBar>
            <BarLeft>
              <Button
                onClick={this.editTerminal}
                disabled={
                  !this.state.selection || this.state.selection.length !== 1
                }
              >
                编辑
              </Button>
              <Button onClick={this.admitAccessTerminal}>允许接入</Button>
              <Button onClick={this.onTerminal}>开机</Button>
              <Button onClick={this.offTerminal}>关机</Button>
              <Button onClick={this.detailTerminal}>查看详情</Button>
              {/* <Button onClick={this.newTerminal}>操作</Button> */}
            </BarLeft>
            <BarRight>
              <Button>删除</Button>
            </BarRight>
          </ToolBar>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.tableCfg}
            onSelectChange={(selection, selectData) => {
              this.setState({ selection, selectData })
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
            initChartValue={this.state.initChartValue}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
