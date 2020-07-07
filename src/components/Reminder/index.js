import React from 'react'
import MyIcon from '../MyIcon'
import { Popover } from 'antd'
import './index.less'

function Reminder(props) {
  const { title, tips = 'test', style } = props
  return (
    <span style={{ ...style }} className="reminder">
      <Popover
        placement="right"
        title={title}
        content={tips}
        trigger="hover"
        className="reminder-popover"
      >
        <MyIcon
          type="vm-unknown"
          component="svg"
          style={{
            fontSize: '24px',
            verticalAlign: 'text-bottom',
            color: '#1890ff'
          }}
        />
      </Popover>
    </span>
  )
}

export { Reminder }
