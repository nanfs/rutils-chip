import React from 'react'
import { Row, Col, Table, Tag, message, Spin, Tooltip, Icon } from 'antd'
import { Title, Diliver } from '@/components'
import desktopsApi from '@/services/desktops'
import { wrapResponse } from '@/utils/tool'
import { osTextRender, availableStatusRender } from '@/utils/tableRender'
import '../../index.less'

const iconStyle = {
  check: { color: '#17abe3' },
  close: { color: '#ff4d4f' }
}

export default class BaseInfo extends React.Component {
  componentDidMount() {
    this.setState({ loading: true })
    desktopsApi.detail(this.props.vmId).then(res =>
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
        ellipsis: true,
        dataIndex: 'username',
        render: value => {
          return value.split('@')[0]
        }
      },
      {
        title: '姓名',
        ellipsis: true,
        dataIndex: 'name'
      },
      {
        title: '组',
        ellipsis: true,
        dataIndex: 'department'
      },
      {
        title: '域',
        ellipsis: true,
        dataIndex: 'domain'
      }
    ]
    const schedulerColums = [
      {
        title: '名称',
        ellipsis: true,
        dataIndex: 'name'
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text => (
          <span className="table-action">
            {text !== 0 ? (
              availableStatusRender('启用')
            ) : (
              <Icon type="stop" style={iconStyle.close} title="停用" />
            )}
          </span>
        )
      },
      {
        title: '任务类型',
        dataIndex: 'taskType',
        render: text => (
          <span className="table-action">
            {text === 1 ? <span>定时关机</span> : <span>定时开机</span>}
          </span>
        )
      },
      {
        title: '执行时间',
        dataIndex: 'cron',
        render: text => {
          const str = text.split(' ')
          return (
            <span>
              {str[2]}:{str[1]}
            </span>
          )
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        ellipsis: true
      },
      {
        title: '最后编辑',
        ellipsis: true,
        dataIndex: 'updateTime'
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
              MAC：
            </Col>
            <Col span={8} className="dms-detail-value">
              {/* 通过网络信息里面取得MAC信息 */}
              <Tooltip title={data.network?.map(item => item.mac).join(',')}>
                <span>{data.network?.map(item => item.mac).join(',')}</span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              操作系统：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={osTextRender(data.os)}>
                <span>{osTextRender(data.os)}</span>
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
              集群：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={data.clusterName}>
                <span>{data.clusterName}</span>
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
              CPU：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={data.cpuCores}>
                <span>{data.cpuCores}</span>
              </Tooltip>
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
              网络：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip
                title={
                  data.network &&
                  data.network
                    .map(item => `${item.kind}/${item.name}`)
                    .join(',')
                }
              >
                <span>
                  {data.network &&
                    data.network
                      .map(item => `${item.kind}/${item.name}`)
                      .join(',')}
                </span>
              </Tooltip>
            </Col>
            <Col span={3} className="dms-detail-label">
              描述：
            </Col>
            <Col span={8} className="dms-detail-value">
              <Tooltip title={data.description} placement="topLeft">
                <span>{data.description}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row className="dms-detail-row"></Row>
        </div>

        <div className="dms-detail-section">
          <Title slot="所属用户"></Title>
          <Table
            columns={userColums}
            dataSource={data.owner}
            rowKey="username"
            pagination={{
              size: 'small',
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50']
            }}
            className="dms-detail-list-hasPagination"
          ></Table>
        </div>
        <div className="dms-detail-section">
          <Title slot="计划任务"></Title>
          <Table
            columns={schedulerColums}
            dataSource={data.schedulerTasks}
            rowKey="id"
            pagination={{
              size: 'small',
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50']
            }}
            className="dms-detail-list-hasPagination"
          ></Table>
        </div>
        <div className="dms-detail-section">
          <Title slot="应用程序"></Title>
          <Row className="dms-detail-row">
            <div>
              {data.appList &&
                data.appList.split(',').map(item => (
                  <Tag color="blue" key={item}>
                    {item}
                  </Tag>
                ))}
            </div>
          </Row>
        </div>
      </Spin>
    )
  }
}
