import React from 'react'
import { Drawerx, Tabsx } from '@/components'
import { Tabs } from 'antd'
import BaseInfo from './detail/BaseInfo'

const { TabPane } = Tabs
export default class DetailDrawer extends React.Component {
  state = { data: {} }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = id => {
    this.drawer.show()
    // 置空 不然有保存 state
    this.setState({ defaultActiveKey: '' }, () =>
      this.setState({ defaultActiveKey: '1', id })
    )
  }

  render() {
    const { id, defaultActiveKey } = this.state
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
            <BaseInfo id={id}></BaseInfo>
          </TabPane>
          <TabPane tab="磁盘管理" key="2">
            磁盘管理
          </TabPane>
          <TabPane tab="快照管理" key="3">
            快照管理
          </TabPane>
        </Tabsx>
      </Drawerx>
    )
  }
}
