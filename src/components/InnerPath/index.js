import React from 'react'
import { Button } from 'antd'
import './index.scss'

export default function InnerPath(props) {
  const { inner, location, onBack } = props
  if (!inner) {
    return <div className="inner-path">{location}</div>
  }
  return (
    <div className="inner-path has-inner">
      <Button onClick={onBack} icon="left" />
      <span className="inner-text">{inner}</span>
      <span className="location-text">&gt; {location}</span>
    </div>
  )
}
