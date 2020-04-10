import React from 'react'
import { Row, Col, Tooltip, Table, message, Tabs } from 'antd'
import { Drawerx, Title } from '@/components'
import { detailUserColumns } from './DetailUserTableCfg'
import { detailSafepolicyColumns } from './DetailSafepolicyTableCfg'
import { DetailAccesspolicyColumns } from './DetailAccesspolicyTableCfg'
import { detailUseTimeColumns } from './DetailUseTimeTableCfg'
// import DetailUseStatisticsChart from './DetailUseStatisticsChart'

import terminalApi from '@/services/terminal'

const { TabPane } = Tabs

export default class DetailDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = { initValues: { useTime: [] } }

  /**
   * @memberof DetailDrawer
   * @param sn 终端sn
   * @description 打开终端详情抽屉，传入终端sn查询终端详情
   * @author linghu
   */
  pop = sn => {
    this.drawer.show()
    terminalApi
      .terminalsdetail(sn)
      .then(res => {
        if (res.success) {
          const onlineTimeArray = res.data.onlineTime.split(',')
          const offlineTimeArray = res.data.offlineTime.split(',')
          if (onlineTimeArray.length > offlineTimeArray.length) {
            for (
              let i = 0;
              i < onlineTimeArray.length - offlineTimeArray.length;
              i++
            ) {
              offlineTimeArray.unshift('')
            }
          }
          const useTime = onlineTimeArray.map((element, index) => {
            return {
              key: `useTime${index}`,
              onlineTime: element,
              offlineTime: offlineTimeArray[index]
            }
          })
          this.setState({
            initValues: { ...res.data, useTime }
          })
        } else {
          message.error(res.message || '查询失败')
        }
      })
      .catch(errors => {
        console.log(errors)
      })
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
        <Tabs>
          <TabPane tab="基本信息" key="basicInfo">
            <div className="dms-detail-section">
              {/* <Title slot="基本信息"></Title> */}
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  终端名称：
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
                  IP：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.ip}>
                    <span>{initValues.ip}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  物理地址：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.mac}>
                    <span>{initValues.mac}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  终端类型：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.terminalType}>
                    <span>{initValues.terminalType}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  位置：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.location}>
                    <span>{initValues.location}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  CPU：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.cpu}>
                    <span>{initValues.cpu}</span>
                  </Tooltip>
                </Col>
                <Col span={3} className="dms-detail-label">
                  内存：
                </Col>
                <Col span={8} className="dms-detail-value">
                  <Tooltip title={initValues.memory}>
                    <span>{initValues.memory}</span>
                  </Tooltip>
                </Col>
              </Row>
              <Row className="dms-detail-row">
                <Col span={3} className="dms-detail-label">
                  描述：
                </Col>
                <Col span={12} className="dms-detail-value">
                  <Tooltip title={initValues.description} placement="topLeft">
                    <span>{initValues.description}</span>
                  </Tooltip>
                </Col>
              </Row>
              {/* // TODO 终端未实现 */}
              {/* 
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              版本号：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.version}>
                <span>{initValues.version}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              操作系统：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.os}>
                <span>{initValues.os}</span>
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
              认证方式：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.loginWay}>
                <span>{initValues.loginWay}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              描述：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={initValues.description}>
                <span>{initValues.description}</span>
              </Tooltip>
            </Col>
          </Row> */}
            </div>
            <div className="dms-detail-section">
              <Title slot="所属用户"></Title>
              <Table
                columns={detailUserColumns}
                dataSource={initValues.users}
                pagination={false}
                rowKey="userId"
              />
            </div>
            <div className="dms-detail-section">
              <Title slot="外设控制"></Title>
              <Table
                columns={detailSafepolicyColumns}
                dataSource={initValues.safePolicys}
                pagination={false}
                rowKey="id"
              />
            </div>
            <div className="dms-detail-section">
              <Title slot="准入控制"></Title>
              <Table
                columns={DetailAccesspolicyColumns}
                dataSource={initValues.admitPolicys}
                pagination={false}
                rowKey="id"
              />
            </div>
            <div className="dms-detail-section">
              <Title slot="使用时间"></Title>
              <Table
                columns={detailUseTimeColumns}
                dataSource={initValues.useTime}
                pagination={false}
              />
            </div>
            {/* <div className="dms-detail-section">
          <Title slot="使用统计"></Title>
          <DetailUseStatisticsChart dataSource={initChartValue} />
        </div> */}
          </TabPane>
        </Tabs>
      </Drawerx>
    )
  }
}
