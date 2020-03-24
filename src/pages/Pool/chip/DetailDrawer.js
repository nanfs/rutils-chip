import React from 'react'
import { Drawerx, Tabsx } from '@/components'
import { Tabs } from 'antd'
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
    this.setState({ defaultActiveKey: '' }, () =>
      this.setState({ defaultActiveKey: '1', poolId: id })
    )
  }

  render() {
    const { poolId, defaultActiveKey } = this.state
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
        <Tabsx defaultActiveKey={defaultActiveKey}>
          <TabPane tab="基础信息" key="1">
            <BaseInfo poolId={poolId}></BaseInfo>
          </TabPane>
          <TabPane tab="桌面列表" key="2">
            <Vmlist poolId={poolId}></Vmlist>
          </TabPane>
          {/* <TabPane tab="已分配用户" key="3"></TabPane> */}
        </Tabsx>
      </Drawerx>
    )
  }
}
