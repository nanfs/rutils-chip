import React from 'react'
import { Row, Col, Tooltip, Table } from 'antd'
import Drawerx from '@/components/Drawerx'
import Title from '@/components/Title'
import { detailUserColumns } from './DetailUserTableCfg'
import { detailSafepolicyColumns } from './DetailSafepolicyTableCfg'
import { detailAdmitpolicyColumns } from './DetailAdmitpolicyTableCfg'
import { detailUseTimeColumns } from './DetailUseTimeTableCfg'
import DetailUseStatisticsChart from './DetailUseStatisticsChart'

export default class DetailDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    /* userTableCfg: createTableCfg({
      data: this.props.initValues.owner,
      columns: detailUserColumns,
      hasPaging: false,
      hasRowSelection: false
    }),
    safepolicyTableCfg: createTableCfg({
      columns: detailSafepolicyColumns,
      hasPaging: false,
      hasRowSelection: false
    }),
    admitpolicyTableCfg: createTableCfg({
      columns: detailAdmitpolicyColumns,
      hasPaging: false,
      hasRowSelection: false
    }),
    usetimeTableCfg: createTableCfg({
      columns: detailUseTimeColumns,
      hasPaging: false,
      hasRowSelection: false
    }) */
  }

  render() {
    const { initValues, initChartValue } = this.props
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
          <Title slot="基本信息"></Title>
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
          <Table
            columns={detailUserColumns}
            dataSource={initValues.owner}
            pagination={false}
          />
        </div>
        <div className="dms-detail-section">
          <Title slot="安全策略"></Title>
          <Table
            columns={detailSafepolicyColumns}
            dataSource={initValues.safePolicys}
            pagination={false}
          />
        </div>
        <div className="dms-detail-section">
          <Title slot="准入策略"></Title>
          <Table
            columns={detailAdmitpolicyColumns}
            dataSource={initValues.admitPolicys}
            pagination={false}
          />
        </div>
        <div className="dms-detail-section">
          <Title slot="使用时间"></Title>
          <Table
            columns={detailUseTimeColumns}
            dataSource={initValues.owner}
            pagination={false}
          />
        </div>
        <div className="dms-detail-section">
          <Title slot="使用统计"></Title>
          <DetailUseStatisticsChart dataSource={initChartValue} />
        </div>
      </Drawerx>
    )
  }
}
