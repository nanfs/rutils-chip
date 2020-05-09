import React from 'react'
import { Tabs } from 'antd'

export default class Tabsx extends React.Component {
  state = {
    activeKey: ''
  }

  render() {
    const { children, defaultActiveKey, ...prop } = this.props
    const { activeKey } = this.state
    const currentKey =
      defaultActiveKey && activeKey ? activeKey.substr(2) : defaultActiveKey
    return (
      <Tabs
        defaultActiveKey={defaultActiveKey || activeKey}
        {...prop}
        onTabClick={key => {
          this.setState({ activeKey: key })
        }}
      >
        {React.Children.map(children, child => {
          if (!child) return
          if (child.key === currentKey) {
            return React.cloneElement(child)
          } else {
            return React.cloneElement(child, { children: null })
          }
        })}
      </Tabs>
    )
  }
}
