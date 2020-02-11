import React from 'react'
import { Row, Col, Tooltip } from 'antd'
import Drawerx from '@/components/Drawerx'
import Tablex, { createTableCfg } from '@/components/Tablex'
import { detailUserColumns, detailUserApiMethod } from './DetailUserTableCfg'
import {
  detailSafepolicyColumns,
  detailSafepolicyApiMethod
} from './DetailSafepolicyTableCfg'
import {
  detailAdmitpolicyColumns,
  detailAdmitpolicyApiMethod
} from './DetailAdmitpolicyTableCfg'
import {
  detailUseTimeColumns,
  detailUseTimeApiMethod
} from './DetailUseTimeTableCfg'

import Title from '@/components/Title'

export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    userTableCfg: createTableCfg({
      columns: detailUserColumns,
      apiMethod: detailUserApiMethod,
      searchs: { id: this.props.initValues.id },
      hasPaging: false,
      hasRowSelection: false
    }),
    safepolicyTableCfg: createTableCfg({
      columns: detailSafepolicyColumns,
      apiMethod: detailSafepolicyApiMethod,
      searchs: { id: this.props.initValues.id },
      hasPaging: false,
      hasRowSelection: false
    }),
    admitpolicyTableCfg: createTableCfg({
      columns: detailAdmitpolicyColumns,
      apiMethod: detailAdmitpolicyApiMethod,
      searchs: { id: this.props.initValues.id },
      hasPaging: false,
      hasRowSelection: false
    }),
    usetimeTableCfg: createTableCfg({
      columns: detailUseTimeColumns,
      apiMethod: detailUseTimeApiMethod,
      searchs: { id: this.props.initValues.id },
      hasPaging: false,
      hasRowSelection: false
    })
  }

  render() {
    const { initValues } = this.props
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
        }}
      >
        <div className="dms-detail-section">
          <Title slot="基础设置"></Title>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              桌面名称:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.name}>
                <span>{initValues.name}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              序列号：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.sn}>
                <span>{initValues.sn}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              位置:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.location}>
                <span>{initValues.location}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              终端类型:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.terminal_type}>
                <span>{initValues.terminal_type}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              版本号:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.version}>
                <span>{initValues.version}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              操作系统:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.os}>
                <span>{initValues.os}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              CPU:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.cpu}>
                <span>{initValues.cpu}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              内存:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.memory}>
                <span>{initValues.memory}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              自动锁屏时间:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.autoLockTime}>
                <span>{initValues.autoLockTime}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              认证方式:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.loginWay}>
                <span>{initValues.loginWay}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              描述:
            </Col>
            <Col span={12} className="dms-detail-value">
              <Tooltip title={initValues.description}>
                <span>{initValues.description}</span>
              </Tooltip>
            </Col>
          </Row>
        </div>
        <div className="dms-detail-section">
          <Title slot="所属用户"></Title>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.userTableCfg}
          />
        </div>
        <div className="dms-detail-section">
          <Title slot="安全策略"></Title>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.safepolicyTableCfg}
          />
        </div>
        <div className="dms-detail-section">
          <Title slot="准入策略"></Title>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.admitpolicyTableCfg}
          />
        </div>
        <div className="dms-detail-section">
          <Title slot="使用时间"></Title>
          <Tablex
            onRef={ref => {
              this.tablex = ref
            }}
            tableCfg={this.state.usetimeTableCfg}
          />
        </div>
      </Drawerx>
    )
  }
}
