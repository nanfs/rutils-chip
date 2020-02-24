import React from 'react'
import { List, Icon, Popover } from 'antd'
import { renderServerityOptions } from '@/utils/tableRender'

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
                    {renderServerityOptions(item.severity)}
                    {/* <Icon type="warning" /> */}
                    {item.userName}
                  </span>
                  <span
                    style={{ position: 'absolute', right: 0, color: '#a0a0a0' }}
                  >
                    {item.logTime}
                  </span>
                </div>
              }
              description={
                <Popover
                  placement="bottomRight"
                  content={<div>{item.message}</div>}
                >
                  {item.message}
                </Popover>
              }
            />
          </List.Item>
        )}
      />
    )
  }
}
