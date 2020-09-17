import React from 'react'
import { Button } from 'antd'
import './index.less'

export default function InnerPath(props) {
  const { inner, location, onBack, children, description } = props
  if (!inner) {
    return (
      <>
        <div className="inner-path">
          {location}
          {children}
        </div>
        {description && <h3 className="col-description">{description}</h3>}
      </>
    )
  }
  return (
    <div className="inner-path has-inner">
      <Button onClick={onBack} icon="left" />
      <span className="inner-text">{inner}</span>
      <span className="location-text"> &lt; {location}</span>
    </div>
  )
}
