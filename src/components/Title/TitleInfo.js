import React from 'react'
import { Icon } from 'antd'
import { NavLink } from 'react-router-dom'

export default function TitleInfo(props) {
  const { slot, more, url } = props
  console.log(more)
  return (
    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
      <Icon type="info" />
      <span>{slot}</span>
      {url && (
        <NavLink to={url}>
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
        </NavLink>
      )}
    </p>
  )
}
