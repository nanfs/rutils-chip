import React from 'react'
import { Drawerx } from '@/components'
import { message, Tabs } from 'antd'
import poolsApi from '@/services/pools'
import BaseInfo from './detail/BaseInfo'
import Vmlist from './detail/Vmlist'

const { TabPane } = Tabs
export default class DetailDrawer extends React.Component {
  state = { data: {} }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = id => {
    this.drawer.show()
    poolsApi
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
          <TabPane tab="桌面列表" key="2">
            <Vmlist data={data}></Vmlist>
          </TabPane>
          {/* <TabPane tab="已分配用户" key="3"></TabPane> */}
        </Tabs>
      </Drawerx>
    )
  }
}
