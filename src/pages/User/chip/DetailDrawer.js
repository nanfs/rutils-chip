import React from 'react'
import { Row, Col, Tooltip, Tabs } from 'antd'
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
      hasRowSelection: false
    }),
    desktopTableCfg: createTableCfg({
      apiMethod: detailDesktopApiMethod,
      columns: detailDesktopColumns,
      paging: { size: 5 },
      pageSizeOptions: ['5', '10'],
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
              用户名:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.name}>
                <span>{initValues.name}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              姓名：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.sn}>
                <span>{initValues.sn}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              用户组:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.location}>
                <span>{initValues.location}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              角色:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.terminal_type}>
                <span>{initValues.terminal_type}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              邮箱:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.version}>
                <span>{initValues.version}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              状态:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.os}>
                <span>{initValues.os}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              桌面数量:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.cpu}>
                <span>{initValues.cpu}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              终端数量:
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.memory}>
                <span>{initValues.memory}</span>
              </Tooltip>
            </Col>
          </Row>
        </div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="已分配桌面" key="1">
            <Tablex
              onRef={ref => {
                this.tablex = ref
              }}
              className="no-select-bg"
              tableCfg={this.state.desktopTableCfg}
              onSelectChange={(selection, selectData) => {
                this.setState({ selection, selectData })
              }}
            />
          </TabPane>
          <TabPane tab="已分配终端" key="2">
            <Tablex
              onRef={ref => {
                this.tablex = ref
              }}
              className="no-select-bg"
              tableCfg={this.state.terminalTableCfg}
              onSelectChange={(selection, selectData) => {
                this.setState({ selection, selectData })
              }}
            />
          </TabPane>
        </Tabs>
      </Drawerx>
    )
  }
}
