import React from 'react'
import { Drawerx, Tabsx } from '@/components'
import { Tabs } from 'antd'
import BaseInfo from './detail/BaseInfo'
import Disklist from './detail/Disklist'
import Snaplist from './detail/Snaplist'

const { TabPane } = Tabs
export default class DetailDrawer extends React.Component {
  state = { data: {} }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = (id, status, clusterCpuName) => {
    // 如果是开机状态下的SW
    const isOpenedSW = status === 1 && clusterCpuName === 'SW1621'
    this.drawer.show()
    // 用这种方式 重刷组件
    this.setState({ defaultActiveKey: '' }, () =>
      this.setState({
        defaultActiveKey: '1',
        id,
        status,
        clusterCpuName,
        isOpenedSW
      })
    )
  }

  onClose = () => {
    this.setState({ defaultActiveKey: '1' })
    const { onClose } = this.props
    onClose && onClose()
  }

  render() {
    const { id, defaultActiveKey, status, isOpenedSW } = this.state
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.onClose}
        onOk={values => {
          console.log(values)
        }}
      >
        <Tabsx defaultActiveKey={defaultActiveKey}>
          <TabPane tab="基础信息" key="1">
            <BaseInfo vmId={id}></BaseInfo>
          </TabPane>
          <TabPane tab="磁盘管理" key="2">
            <Disklist
              vmId={id}
              status={status}
              isOpenedSW={isOpenedSW}
            ></Disklist>
          </TabPane>
          <TabPane tab="快照管理" key="3">
            <Snaplist vmId={id} isOpenedSW={isOpenedSW}></Snaplist>
          </TabPane>
        </Tabsx>
      </Drawerx>
    )
  }
}
