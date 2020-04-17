import React from 'react'
import { Drawerx, Tabsx } from '@/components'
import { Tabs } from 'antd'
import BaseInfo from './detail/BaseInfo'
import Disklist from './detail/Disklist'
// import Snaplist from './detail/Snaplist'

const { TabPane } = Tabs
export default class DetailDrawer extends React.Component {
  state = { data: {} }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = (id, status) => {
    this.drawer.show()
    this.setState({ defaultActiveKey: '' }, () =>
      this.setState({ defaultActiveKey: '1', id, status })
    )
  }

  render() {
    const { id, defaultActiveKey, status } = this.state
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
            <BaseInfo vmId={id}></BaseInfo>
          </TabPane>
          <TabPane tab="磁盘管理" key="2">
            <Disklist vmId={id} status={status}></Disklist>
          </TabPane>
          {/* <TabPane tab="快照管理" key="3">
            <Snaplist vmId={id}></Snaplist>
          </TabPane> */}
        </Tabsx>
      </Drawerx>
    )
  }
}
