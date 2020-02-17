import React from 'react'
import { List, Icon, Popover } from 'antd'

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
                  <span
                    style={{ position: 'absolute', right: 0, color: '#a0a0a0' }}
                  >
                    {item.datetime}
                  </span>
                </div>
              }
              description={
                <Popover
                  placement="bottomRight"
                  content={<div>{item.content}</div>}
                >
                  {item.content}
                </Popover>
              }
            />
          </List.Item>
        )}
      />
    )
  }
}
