import React from 'react'
import { Row, Col, Tooltip, Tabs, message } from 'antd'
import produce from 'immer'
import Tablex, { createTableCfg } from '@/components/Tablex'
import Drawerx from '@/components/Drawerx'
import Title from '@/components/Title'
import {
  detailTeminalColumns,
  detailTeminalApiMethod
} from './DetailTerminalTableCfg'
import {
  detailDesktopColumns,
  detailDesktopApiMethod
} from './DetailDesktopTableCfg'

import userApi from '@/services/user'

const { TabPane } = Tabs

export default class DetailDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    terminalTableCfg: createTableCfg({
      apiMethod: detailTeminalApiMethod,
      columns: detailTeminalColumns,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10'],
      hasRowSelection: false,
      hasPaging: false
    }),
    desktopTableCfg: createTableCfg({
      apiMethod: detailDesktopApiMethod,
      columns: detailDesktopColumns,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10'],
      hasRowSelection: false,
      hasPaging: false
    }),
    initValues: {}
  }

  pop = data => {
    this.drawer.show()
    this.setState(
      produce(draft => {
        draft.initValues = {
          ...data,
          statusName: data.status && data.status === 0 ? '正常' : '锁定'
        }
        draft.terminalTableCfg.searchs = { userId: data.id }
        draft.desktopTableCfg.searchs = { userId: data.id }
      }),
      () => {
        this.desktopTablex.refresh(this.state.desktopTableCfg)
        this.terminalTablex.refresh(this.state.terminalTableCfg)
      }
    )
  }

  render() {
    const { initValues } = this.state
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
        }}
        onClose={this.props.onClose}
      >
        <div className="dms-detail-section">
          <Title slot="基础设置"></Title>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              用户名：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.username}>
                <span>{initValues.username}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              姓名：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip
                title={
                  initValues.firstname &&
                  initValues.lastname &&
                  initValues.firstname + initValues.lastname
                }
              >
                <span>
                  {initValues.firstname &&
                    initValues.lastname &&
                    initValues.firstname + initValues.lastname}
                </span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              组织：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.groupName}>
                <span>{initValues.groupName}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              角色：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.roleName}>
                <span>{initValues.roleName}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              邮箱：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.email}>
                <span>{initValues.email}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              状态：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.statusName}>
                <span>{initValues.statusName}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              已分配桌面数量：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.vmcount}>
                <span>{initValues.vmcount}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              已分配终端数量：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.tccount}>
                <span>{initValues.tccount}</span>
              </Tooltip>
            </Col>
          </Row>
        </div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="已分配桌面" key="1">
            <Tablex
              onRef={ref => {
                this.desktopTablex = ref
              }}
              className="no-select-bg"
              tableCfg={this.state.desktopTableCfg}
              onSelectChange={(selection, selectData) => {
                this.setState({ selection, selectData })
              }}
              stopFetch={true}
            />
          </TabPane>
          <TabPane tab="已分配终端" key="2" forceRender={true}>
            <Tablex
              onRef={ref => {
                this.terminalTablex = ref
              }}
              className="no-select-bg"
              tableCfg={this.state.terminalTableCfg}
              onSelectChange={(selection, selectData) => {
                this.setState({ selection, selectData })
              }}
              stopFetch={true}
            />
          </TabPane>
        </Tabs>
      </Drawerx>
    )
  }
}
