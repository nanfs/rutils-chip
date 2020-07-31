import React from 'react'
import MyIcon from '../MyIcon'
import { Popover } from 'antd'
import './index.less'

function Reminder(props) {
  const { placement = 'right', tips, style, iconStyle } = props
  return (
    <span
      style={{
        marginLeft: 5,
        ...style
      }}
      className="reminder"
    >
      <Popover
        placement={placement}
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
            color: '#1890ff',
            ...iconStyle
          }}
        />
      </Popover>
    </span>
  )
}

export { Reminder }
