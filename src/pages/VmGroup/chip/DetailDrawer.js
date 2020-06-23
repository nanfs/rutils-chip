import React from 'react'
import { Drawerx, Tabsx } from '@/components'
import { Tabs } from 'antd'
import Vmlist from './detail/Vmlist'

const { TabPane } = Tabs
export default class DetailDrawer extends React.Component {
  state = { data: {} }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = (id, status) => {
    this.drawer.show()
    // 用这种方式 重刷组件
    this.setState({ defaultActiveKey: '' }, () =>
      this.setState({ defaultActiveKey: '1', id, status })
    )
  }

  onClose = () => {
    this.setState({ defaultActiveKey: '1' })
    const { onClose } = this.props
    onClose && onClose()
  }

  render() {
    const { id, defaultActiveKey } = this.state
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.onClose}
      >
        <Tabsx defaultActiveKey={defaultActiveKey}>
          <TabPane tab="桌面列表" key="1">
            <Vmlist groupId={id}></Vmlist>
          </TabPane>
          <TabPane tab="高低峰配置" key="2"></TabPane>
        </Tabsx>
      </Drawerx>
    )
  }
}
