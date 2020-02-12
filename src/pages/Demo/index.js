import React from 'react'
import { Tabs } from 'antd'
import TabpanTablex from './chip/TabpanTablex'
import TabpanFormx from './chip/TabpanFormx'
import TabpanModalx from './chip/TabpanModalx'

const { TabPane } = Tabs
class Dashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Tabs tabPosition="left">
          <TabPane tab="表格demo" key="tablbx">
            <TabpanTablex />
          </TabPane>
          <TabPane tab="表单demo" key="formx">
            <TabpanFormx />
          </TabPane>
          <TabPane tab="弹窗demo" key="modalx">
            <TabpanModalx />
          </TabPane>
        </Tabs>
      </React.Fragment>
    )
  }
}

export default Dashboard
