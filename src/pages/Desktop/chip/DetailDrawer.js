import React from 'react'
import Drawerx from '@/components/Drawerx'
import { Row, Col, Table } from 'antd'
import Title, { Diliver } from '@/components/Title'

export default class DetailDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  render() {
    const { data = {} } = this.props
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
    const diskColums = [
      {
        title: '名称',
        dataIndex: 'name'
      },
      {
        title: '大小(GB)',
        dataIndex: 'size'
      },
      {
        title: '状态',
        dataIndex: 'status'
      },
      {
        title: '描述',
        dataIndex: 'description'
      }
    ]
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
        }}
      >
        <Title slot="基础设置"></Title>
        <Row>
          <Col>桌面名称：</Col>
          <Col>{data.name}</Col>
          <Col>数据中心：</Col>
          <Col>{data.datacenter}</Col>
          <Col>模板</Col>
          <Col>{data.template}</Col>
          <Col>集群：</Col>
          <Col>{data.cluster}</Col>
          <Col>USB个数：</Col>
          <Col>{data.usbNumb}</Col>
          <Col>CPU：</Col>
          <Col>{data.cpu}</Col>
          <Col>ID：</Col>
          <Col>{data.id}</Col>
          <Col>内存：</Col>
          <Col>{data.memory}</Col>
          <Col>描述：</Col>
          <Col>{data.description}</Col>
          <Col>IP：</Col>
          <Col>{data.ip}</Col>
        </Row>
        <Diliver />
        <Title slot="所属用户"></Title>
        <Table columns={userColums} dataSource={data.user}></Table>
        <Diliver />
        <Title slot="应用程序"></Title>
        <Table columns={appColums} dataSource={data.user}></Table>
        <Diliver />
        <Title slot="磁盘"></Title>
        <Table columns={diskColums} dataSource={data.user}></Table>
        <Diliver />
        <Title slot="使用统计"></Title>
        <Table dataSource={data.user}></Table>
        <Diliver />
      </Drawerx>
    )
  }
}
