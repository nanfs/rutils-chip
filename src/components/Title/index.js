import React from 'react'
import MyIcon from '../MyIcon'
import { NavLink } from 'react-router-dom'
import './index.less'

function Diliver(props) {
  const { heigth } = props
  return (
    <div
      className="drawer-form-diliver diliver"
      style={{ height: heigth || '15px' }}
    ></div>
  )
}
function Title(props) {
  const { slot } = props
  return (
    <p className="drawer-form-title">
      <span>{slot}</span>
      {props.children &&
        React.Children.map(
          props.children,
          child => child && React.cloneElement(child, {})
        )}
    </p>
  )
}

function TitleInfo(props) {
  const { slot, more, url, style } = props
  return (
    <p style={{ ...style }} className="table-title">
      <MyIcon
        type="sd"
        component="svg"
        style={{
          fontSize: '30px',
          verticalAlign: 'middle'
        }}
      />
      <span
        style={{
          verticalAlign: 'middle'
        }}
      >
        {slot}
      </span>
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

export { TitleInfo, Title, Diliver }
