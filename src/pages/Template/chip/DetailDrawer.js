import React from 'react'
import { Tabs, Row, Col, Icon, Tooltip } from 'antd'
import { Drawerx, Tabsx } from '@/components'
import '../index.less'
import Vmlist from './detail/Vmlist'

const { TabPane } = Tabs
// const { createTableCfg } = Tablex

export default class DetailDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    data: {}
  }

  /**
   * @param id 模板id
   * @param info 详情数据
   */
  pop = (id, info) => {
    this.drawer.show()
    this.setState({ data: info })
    this.setState({ defaultActiveKey: '' }, () =>
      this.setState({ defaultActiveKey: 'basicInfo', id })
    )
  }

  render() {
    const { data, defaultActiveKey } = this.state
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
      >
        <Tabsx defaultActiveKey={defaultActiveKey}>
          <TabPane tab="基本信息" key="basicInfo">
            <div className="dms-detail-section">
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  模板名称：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={data.name}>
                    <span>{data.name}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  已使用桌面数：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={data.vmUsed}>
                    <span>{data.vmUsed}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  父模板：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={data.parentName}>
                    <span>{data.parentName}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  数据中心：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={data.datacenterName}>
                    <span>{data.datacenterName}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  集群：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={data.clusterName}>
                    <span>{data.clusterName}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  状态：
                </Col>
                {data.status == '1' && (
                  <Col span={8} className="dms-detail-value">
                    <Icon type="lock" className="lock" /> 锁定
                  </Col>
                )}
                {data.status == '0' && (
                  <Col span={8} className="dms-detail-value can-use">
                    <Icon type="check-circle" /> 可用
                  </Col>
                )}
                {data.status == '2' && (
                  <Col span={8} className="dms-detail-value safety">
                    <Icon type="safety" /> 合法
                  </Col>
                )}
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  描述：
                </Col>
                <Col span={12} className="dms-detail-value">
                  <Tooltip title={data.description} placement="topLeft">
                    <span>{data.description}</span>
                  </Tooltip>
                </Col>
              </Row>
            </div>
          </TabPane>
          <TabPane tab="桌面列表" key="bindVmList">
            <Vmlist templateId={data.id}></Vmlist>
          </TabPane>
        </Tabsx>
      </Drawerx>
    )
  }
}
