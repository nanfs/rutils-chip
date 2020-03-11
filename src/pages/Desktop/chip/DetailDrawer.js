import React from 'react'
import { Drawerx } from '@/components'
import { message, Tabs } from 'antd'
import desktopsApi from '@/services/desktops'
import BaseInfo from './detail/BaseInfo'

const { TabPane } = Tabs
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
      })
      .catch(errors => {
        message.error(errors)
        console.log(errors)
      })
  }

  render() {
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
        <Tabs defaultActiveKey="1">
          <TabPane tab="基础信息" key="1">
            <BaseInfo data={data}></BaseInfo>
          </TabPane>
          <TabPane tab="磁盘管理" key="2">
            磁盘管理
          </TabPane>
          <TabPane tab="快照管理" key="3">
            快照管理
          </TabPane>
        </Tabs>
      </Drawerx>
    )
  }
}
