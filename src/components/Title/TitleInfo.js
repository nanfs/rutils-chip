import React from 'react'
import { Icon } from 'antd'

export default function TitleInfo(props) {
  const { slot, more } = props
  return (
    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
      <Icon type="info" />
      <span>{slot}</span>
      <span
        style={{
          float: 'right',
          paddingRight: 10,
          fontWeight: 'normal',
          fontSize: '14px',
          lineHeight: '26px'
        }}
      >
        {more}
      </span>
    </p>
  )
}
