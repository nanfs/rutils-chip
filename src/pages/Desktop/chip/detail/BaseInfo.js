import React from 'react'
import { Row, Col, Table, Tag, message, Spin, Tooltip } from 'antd'
import { Title, Diliver } from '@/components'
import desktopsApi from '@/services/desktops'
import { osTextRender } from '@/utils/tableRender'

export default class BaseInfo extends React.Component {
  componentDidMount() {
    this.setState({ loading: true })
    desktopsApi
      .detail(this.props.vmId)
      .then(res => {
        this.setState({ loading: false, data: res.data })
      })
      .catch(error => {
        this.setState({ loading: false })
        message.error(error.message || error)
        console.log(error)
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
    return (
      <Spin spinning={loading}>
        <div className="dms-detail-section">
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              桌面名称：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={data.name}>
                <span>{data.name}</span>
              </Tooltip>
              {/* {data.name} */}
            </Col>
            <Col span={3} className="dms-detail-label">
              数据中心：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={data.datacenterName}>
                <span>{data.datacenterName}</span>
              </Tooltip>
              {/* {data.datacenterName} */}
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              MAC：
            </Col>
            <Col span={8} className="dms-detail-value">
              {/* 通过网络信息里面取得MAC信息 */}
              <Tooltip title={data.network?.map(item => item.mac).join(',')}>
                <span>{data.network?.map(item => item.mac).join(',')}</span>
              </Tooltip>
              {/* {data.network?.map(item => item.mac).join(',')} */}
            </Col>
            <Col span={3} className="dms-detail-label">
              操作系统：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={osTextRender(data.os)}>
                <span>{osTextRender(data.os)}</span>
              </Tooltip>
              {/* {osTextRender(data.os)} */}
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
              {/* {data.templateName} */}
            </Col>
            <Col span={3} className="dms-detail-label">
              集群：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={data.clusterName}>
                <span>{data.clusterName}</span>
              </Tooltip>
              {/* {data.clusterName} */}
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
              {/* <span title={data.id}>{data.id}</span> */}
            </Col>
            <Col span={3} className="dms-detail-label">
              CPU：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={data.cpuCores}>
                <span>{data.cpuCores}</span>
              </Tooltip>
              {/* {data.cpuCores} */}
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              IP：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={data.ip}>
                <span>{data.ip}</span>
              </Tooltip>
              {/* <span title={data.ip}>{data.ip}</span> */}
            </Col>
            <Col span={3} className="dms-detail-label">
              内存：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={data.memory}>
                <span>{data.memory} G</span>
              </Tooltip>
              {/* {data.memory} G */}
            </Col>
          </Row>
          <Row className="dms-detail-row">
            <Col span={3} className="dms-detail-label">
              网络：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip
                title={
                  data.network &&
                  data.network
                    .map(item => `${item.kind}/${item.vnic}`)
                    .join(',')
                }
              >
                <span>
                  {data.network &&
                    data.network
                      .map(item => `${item.kind}/${item.vnic}`)
                      .join(',')}
                </span>
              </Tooltip>
              {/* {data.network &&
                data.network.map(item => `${item.kind}/${item.vnic}`).join(',')} */}
            </Col>
            <Col span={3} className="dms-detail-label">
              描述：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={data.description}>
                <span>{data.description}</span>
              </Tooltip>
              {/* <span title={data.description}>{data.description}</span> */}
            </Col>
          </Row>
          <Row className="dms-detail-row"></Row>
        </div>
        {/* <Diliver /> */}

        <div className="dms-detail-section">
          <Title slot="所属用户"></Title>
          <Table
            columns={userColums}
            dataSource={data.owner}
            rowKey="username"
            pagination={{ position: 'none' }}
          ></Table>
        </div>
        {/* <Diliver /> */}
        <div className="dms-detail-section">
          <Title slot="应用程序"></Title>
          <Row className="dms-detail-row">
            <div>
              {data.appList &&
                data.appList
                  .split(',')
                  .map(item => <Tag key={item}>{item}</Tag>)}
            </div>
          </Row>
        </div>
      </Spin>
    )
  }
}
