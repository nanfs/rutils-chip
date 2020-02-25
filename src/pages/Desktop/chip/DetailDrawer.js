import React from 'react'
import Drawerx from '@/components/Drawerx'
import { Row, Col, Table } from 'antd'
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
    const appColums = [
      {
        title: '程序名称',
        dataIndex: 'app'
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
        <Row>
          <Col span={3}>桌面名称：</Col>
          <Col span={8}>{data.name}</Col>
          <Col span={3}>数据中心：</Col>
          <Col span={8}>{data.datacenterName}</Col>
        </Row>
        <Row>
          <Col span={3}>模板</Col>
          <Col span={8}>{data.templateName}</Col>
          <Col span={3}>集群：</Col>
          <Col span={8}>{data.clusterName}</Col>
        </Row>
        <Row>
          <Col span={3}>USB个数：</Col>
          <Col span={8}>{data.usbNumb}</Col>
          <Col span={3}>CPU：</Col>
          <Col span={8}>{data.cpuCores}</Col>
        </Row>
        <Row>
          <Col span={3}>ID：</Col>
          <Col span={8}>{data.id}</Col>
          <Col span={3}>内存：</Col>
          <Col span={8}>{data.memory} G</Col>
        </Row>
        <Row>
          <Col span={3}>描述：</Col>
          <Col span={8}>{data.description}</Col>
          <Col span={3}>IP：</Col>
          <Col span={8}>{data.ip}</Col>
        </Row>
        <Diliver />
        <Title slot="所属用户"></Title>
        <Table columns={userColums} dataSource={data.owner}></Table>
        <Diliver />
        <Title slot="应用程序"></Title>
        <Table columns={appColums} dataSource={data.appList || []}></Table>
      </Drawerx>
    )
  }
}
