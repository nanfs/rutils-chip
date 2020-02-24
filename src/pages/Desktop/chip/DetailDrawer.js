import React from 'react'
import Drawerx from '@/components/Drawerx'
import { Row, Col, Table } from 'antd'
import Title, { Diliver } from '@/components/Title'
import desktopsApi from '@/services/desktops'

export default class DetailDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = id => {
    desktopsApi
      .detail(id)
      .then(res => {
        console.log(res)
      })
      .catch(e => {
        console.log(e)
      })
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
          <Col span={8}>{data.datacenter}</Col>
        </Row>
        <Row>
          <Col span={3}>模板</Col>
          <Col span={8}>{data.template}</Col>
          <Col span={3}>集群：</Col>
          <Col span={8}>{data.cluster}</Col>
        </Row>
        <Row>
          <Col span={3}>USB个数：</Col>
          <Col span={8}>{data.usbNumb}</Col>
          <Col span={3}>CPU：</Col>
          <Col span={8}>{data.cpu}</Col>
        </Row>
        <Row>
          <Col span={3}>ID：</Col>
          <Col span={8}>{data.id}</Col>
          <Col span={3}>内存：</Col>
          <Col span={8}>{data.memory}</Col>
        </Row>
        <Row>
          <Col span={3}>描述：</Col>
          <Col span={8}>{data.description}</Col>
          <Col span={3}>IP：</Col>
          <Col span={8}>{data.ip}</Col>
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
