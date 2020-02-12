import React from 'react'
import { Button } from 'antd'
import './index.scss'

export default class UserButton extends React.Component {
  delHandel = () => {
    const { onDel, value } = this.props
    onDel && onDel(value)
  }

  render() {
    const { children } = this.props
    return (
      <div className="user-btn">
        <Button type="close" onClick={this.delHandel}></Button>
        {children}
      </div>
    )
  }
}
