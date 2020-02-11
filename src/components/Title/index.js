import React from 'react'
import './index.scss'

export function Diliver(props) {
  const { heigth } = props
  return (
    <div
      className="drawer-form-diliver"
      style={{ height: heigth || '15px' }}
    ></div>
  )
}
export default function Title(props) {
  const { slot } = props
  return <p className="drawer-form-title">{slot}</p>
}
