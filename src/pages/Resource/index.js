import React from 'react'

import { Tablex, InnerPath } from '@/components'
import { wrapResponse } from '@/utils/tool'
import { Icon, Modal, notification, message } from 'antd'

import TableCompute from './chip/TableCompute'
import TableSave from './chip/TableSave'
import Topology from './chip/Topology'
import DetailDrawer from '@/pages/Desktop/chip/DetailDrawer'

import desktopsApi from '@/services/desktops'

import './index.less'

const { TableWrap } = Tablex
const { confirm } = Modal

export default class Resource extends React.Component {
  state = {
    inner: undefined,
    viewType: false
  }

  viewChange = () => {
    const viewType = !this.state.viewType
    this.setState({ viewType })
  }

  innerChange = name => {
    this.setState({ inner: name })
    this.currentDrawer = this.detailDrawer
  }

  // 关闭内页
  onBack = () => {
    this.setState({ inner: undefined })
    this.currentDrawer.drawer.hide()
  }

  vmDetailShow(id, status, clusterCpuName, name) {
    this.setState(
      { inner: name },
      this.detailDrawer.pop(id, status, clusterCpuName)
    )
    this.currentDrawer = this.detailDrawer
  }

  vmDelete(id) {
    const desktopIds = [id]
    const self = this
    confirm({
      title: '确定删除所选虚拟机?',
      onOk: () => {
        desktopsApi
          .delVm({ desktopIds })
          .then(res =>
            wrapResponse(res).then(() => {
              notification.success({ message: '删除成功' })
              this.tablex.refresh(this.state.tableCfg)
            })
          )
          .catch(error => {
            error.type === 'timeout' && self.tablex.refresh(self.state.tableCfg)
            message.error(error.message || error)
          })
      },
      onCancel() {}
    })
  }

  render() {
    return (
      <React.Fragment>
        <span
          onClick={() => this.viewChange()}
          style={{
            float: 'right',
            marginRight: 30,
            marginTop: 15,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Icon type="swap" style={{ color: '#1990ff' }} />
          切换视图
        </span>
        <InnerPath
          location="资源概览"
          inner={this.state.inner}
          onBack={this.onBack}
        />
        <TableWrap>
          {this.state.viewType ? (
            <div>
              <TableCompute></TableCompute>
              <TableSave></TableSave>
            </div>
          ) : (
            <Topology
              vmDelete={id => this.vmDelete(id)}
              vmDetailShow={(id, status, clusterCpuName, name) =>
                this.vmDetailShow(id, status, clusterCpuName, name)
              }
            ></Topology>
          )}
          <DetailDrawer
            onRef={ref => {
              this.detailDrawer = ref
            }}
            onClose={this.onBack}
          />
        </TableWrap>
      </React.Fragment>
    )
  }
}
