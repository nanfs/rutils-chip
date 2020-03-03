import React from 'react'
import { Drawerx, Title, Diliver } from '@/components'
import { Row, Col, Table, Tag, message } from 'antd'
import desktopsApi from '@/services/desktops'

export default class DetailDrawer extends React.Component {
  state = { data: {} }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = id => {
    this.drawer.show()
    desktopsApi
      .detail(id)
      .then(res => {
        this.setState({ data: res.data })
        console.log(res)
      })
      .catch(errors => {
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
        /* render: (value, record) => {
          return (
            (!record.firstname ? '' : record.firstname) +
            (!record.lastname ? '' : record.lastname)
          )
        } */
      },
      {
        title: '组',
        dataIndex: 'group'
      }
    ]
    const { data } = this.state
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.props.onClose}
        onOk={values => {
          console.log(values)
        }}
      >
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
            模板
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
          {/* <Col span={3}>USB个数：</Col>
          <Col span={8}>{data.usbNum}</Col> */}
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
      </Drawerx>
    )
  }
}
