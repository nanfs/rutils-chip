import React from 'react'
import { Drawerx, Tabsx } from '@/components'
import { Tabs } from 'antd'
import Vmlist from './detail/Vmlist'

const { TabPane } = Tabs
export default class DetailDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = id => {
    this.drawer.show()
    // 用这种方式 重刷组件
    this.setState({ defaultActiveKey: '' }, () =>
      this.setState({ defaultActiveKey: '1', id })
    )
  }

  onClose = () => {
    this.setState({ defaultActiveKey: '1' })
    const { onClose } = this.props
    onClose && onClose()
  }

  render() {
    const { id, defaultActiveKey } = this.state || {}
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
        </Tabsx>
      </Drawerx>
    )
  }
}
