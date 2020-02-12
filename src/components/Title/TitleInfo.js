import React from 'react'
import { Icon } from 'antd'

export default function TitleInfo(props) {
  const { slot } = props
  return (
    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
      <Icon type="info" />
      <span>{slot}</span>
    </p>
  )
}
