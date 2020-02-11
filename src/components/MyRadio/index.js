import React from 'react'
import { Radio } from 'antd'

export default class MyRadio extends React.Component {
  render() {
    const { className, options } = this.props
    return (
      <Radio.Group className={className}>
        {options.map(item => (
          <Radio.Button value={item.value} key={item.value}>
            {item.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    )
  }
}
