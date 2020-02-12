import React from 'react'
import { List, Icon } from 'antd'

export default class LogList extends React.Component {
  render() {
    const { logData } = this.props
    return (
      <List
        itemLayout="horizontal"
        dataSource={logData}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={
                <div>
                  <span style={{ color: '#8697bc' }}>
                    <Icon type="warning" />
                    {item.tcName}
                  </span>
                  <span style={{ float: 'right', color: '#a0a0a0' }}>
                    {item.datetime}
                  </span>
                </div>
              }
              description={item.content}
            />
          </List.Item>
        )}
      />
    )
  }
}
