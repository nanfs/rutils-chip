import React from 'react'
import Drawerx from '@/components/Drawerx'
import { Row, Col, Table, Tag } from 'antd'
import Title, { Diliver } from '@/components/Title'
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
      .catch(e => {
        console.log(e)
      })
  }

  render() {
    const userColums = [
      {
        title: '姓名',
        dataIndex: 'name'
      },
      {
        title: '用户名',
        dataIndex: 'username'
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
        <Diliver />
        <Title slot="所属用户"></Title>
        <Table columns={userColums} dataSource={data.owner}></Table>
        <Diliver />
        <Title slot="应用程序"></Title>
        <div>
          {data.appList &&
            data.appList.split(',').map(item => <Tag key={item}>{item}</Tag>)}
        </div>
      </Drawerx>
    )
  }
}
