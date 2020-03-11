import React from 'react'
import { Row, Col, Table, message, Spin } from 'antd'
import { Title, Diliver } from '@/components'
import poolsApi from '@/services/pools'

export default class BaseInfo extends React.Component {
  componentDidMount() {
    this.setState({ loading: true })
    poolsApi
      .detail(this.props.id)
      .then(res => {
        console.log('res', res)
        this.setState({ loading: false, data: res.data })
      })
      .catch(errors => {
        this.setState({ loading: false })

        message.error(errors)
        console.log(errors)
      })
  }

  render() {
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
    const { loading, data = {} } = this.state || {}
    console.log(data)
    return (
      <Spin spinning={loading}>
        <Title slot="基础设置"></Title>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            桌面池名称：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.name}
          </Col>
          <Col span={3} className="dms-detail-label">
            桌面数：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.desktopNum}
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
            预启动数量：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.prestartNum}
          </Col>
        </Row>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            管理类型：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.managerType ? '手动' : '自动'}
          </Col>
          <Col span={3} className="dms-detail-label">
            用户最大虚拟机数：
          </Col>
          <Col span={8} className="dms-detail-value">
            {data.maxAssignedVmsPerUser}
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
      </Spin>
    )
  }
}
