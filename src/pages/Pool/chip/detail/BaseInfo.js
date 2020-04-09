import React from 'react'
import { Row, Col, Table, message, Spin, Tooltip } from 'antd'
import { Title, Diliver } from '@/components'
import { wrapResponse } from '@/utils/tool'
import poolsApi from '@/services/pools'

export default class BaseInfo extends React.Component {
  componentDidMount() {
    this.setState({ loading: true })
    poolsApi.detail(this.props.poolId).then(res =>
      wrapResponse(res)
        .then(() => {
          this.setState({ loading: false, data: res.data })
        })
        .catch(error => {
          this.setState({ loading: false })
          message.error(error.message || error)
          console.log(error)
        })
    )
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
      },
      {
        title: '域',
        dataIndex: 'domain'
      }
    ]
    const { loading, data = {} } = this.state || {}
    return (
      <Spin spinning={loading}>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            桌面池名称：
          </Col>
          <Col span={8} className="dms-detail-value">
            <Tooltip title={data.name}>
              <span>{data.name}</span>
            </Tooltip>
          </Col>
          <Col span={3} className="dms-detail-label">
            桌面数：
          </Col>
          <Col span={8} className="dms-detail-value">
            <Tooltip title={data.desktopNum}>
              <span>{data.desktopNum}</span>
            </Tooltip>
          </Col>
        </Row>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            模板：
          </Col>
          <Col span={8} className="dms-detail-value">
            <Tooltip title={data.templateName}>
              <span>{data.templateName}</span>
            </Tooltip>
          </Col>
          <Col span={3} className="dms-detail-label">
            预启动数量：
          </Col>
          <Col span={8} className="dms-detail-value">
            <Tooltip title={data.prestartNum}>
              <span>{data.prestartNum}</span>
            </Tooltip>
          </Col>
        </Row>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            管理类型：
          </Col>
          <Col span={8} className="dms-detail-value">
            <Tooltip title={data.managerType ? '手动' : '自动'}>
              <span>{data.managerType ? '手动' : '自动'}</span>
            </Tooltip>
          </Col>
          <Col span={3} className="dms-detail-label">
            用户最大虚拟机数：
          </Col>
          <Col span={8} className="dms-detail-value">
            <Tooltip title={data.maxAssignedVmsPerUser}>
              <span>{data.maxAssignedVmsPerUser}</span>
            </Tooltip>
          </Col>
        </Row>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            CPU：
          </Col>
          <Col span={8} className="dms-detail-value">
            <Tooltip title={data.cpuCores}>
              <span>{data.cpuCores} 核</span>
            </Tooltip>
          </Col>

          <Col span={3} className="dms-detail-label">
            内存：
          </Col>
          <Col span={8} className="dms-detail-value">
            <Tooltip title={data.memory}>
              <span>{data.memory} G</span>
            </Tooltip>
          </Col>
        </Row>
        <Row className="dms-detail-row">
          <Col span={3} className="dms-detail-label">
            ID：
          </Col>
          <Col span={8} className="dms-detail-value">
            <Tooltip title={data.id}>
              <span>{data.id}</span>
            </Tooltip>
          </Col>
          <Col span={3} className="dms-detail-label">
            描述：
          </Col>
          <Col span={8} className="dms-detail-value">
            <Tooltip title={data.description}>
              <span>{data.description}</span>
            </Tooltip>
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
