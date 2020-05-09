import React from 'react'
import { Drawerx, Tabsx } from '@/components'
import { Tabs } from 'antd'
import BaseInfo from './detail/BaseInfo'
import Vmlist from './detail/Vmlist'
import { checkAuth } from '@/utils/checkPermissions'

const { TabPane } = Tabs
export default class DetailDrawer extends React.Component {
  state = { data: {} }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = poolId => {
    this.drawer.show()
    this.setState({ defaultActiveKey: '' }, () =>
      this.setState({
        defaultActiveKey: checkAuth('admin') ? '1' : '2',
        poolId
      })
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
          {checkAuth('admin') && (
            <TabPane tab="基础信息" key="1">
              <BaseInfo poolId={poolId}></BaseInfo>
            </TabPane>
          )}
          <TabPane tab="桌面列表" key="2">
            <Vmlist
              poolId={poolId}
              onDeleteAll={this.props.onDeleteAll}
            ></Vmlist>
          </TabPane>
        </Tabsx>
      </Drawerx>
    )
  }
}
