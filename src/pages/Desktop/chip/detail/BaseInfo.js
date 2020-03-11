import React from 'react'
import { Row, Col, Table, Tag } from 'antd'
import { Title, Diliver } from '@/components'

export default class BaseInfo extends React.Component {
  render() {
    const data = this.props.data || {}
    const userColums = [
      {
        title: '用户名',
        width: 200,
        dataIndex: 'username'
      },
      {
        title: '姓名',
        width: 200,
        dataIndex: 'name'
      },
      {
        title: '组',
        dataIndex: 'department'
      }
    ]
    return (
      <React.Fragment>
        <Title slot="基础设置"></Title>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            桌面名称：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.name}
          </Col>
          <Col span={3} className="dms-detail-label">
            数据中心：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.datacenterName}
          </Col>
        </Row>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            模板：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.templateName}
          </Col>
          <Col span={3} className="dms-detail-label">
            集群：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.clusterName}
          </Col>
        </Row>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            ID：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.id}
          </Col>
          <Col span={3} className="dms-detail-label">
            CPU：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.cpuCores}
          </Col>
        </Row>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            IP：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.ip}
          </Col>
          <Col span={3} className="dms-detail-label">
            内存：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.memory} G
          </Col>
        </Row>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            网络：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.network &&
              data.network.map(item => `${item.kind}/${item.name}`).join(',')}
          </Col>
          <Col span={3} className="dms-detail-label">
            描述：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.description}
          </Col>
        </Row>
        <Row className="dms-detail-row"></Row>
        <Diliver />
        <Title slot="所属用户"></Title>
        <Table
          columns={userColums}
          dataSource={data.owner}
          rowKey="username"
          pagination={{ position: 'none' }}
        ></Table>
        <Diliver />
        <Title slot="应用程序"></Title>
        <Row className="dms-detail-row">
          <div>
            {data.appList &&
              data.appList.split(',').map(item => <Tag key={item}>{item}</Tag>)}
          </div>
        </Row>
      </React.Fragment>
    )
  }
}
