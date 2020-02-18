import React from 'react'
import { Radio } from 'antd'
import './index.scss'

export default class Switchx extends React.Component {
  render() {
    const { options } = this.props
    const optionsValue = options || [
      { label: 'on', value: 'on' },
      { label: 'off', value: 'off' }
    ]
    return (
      <Radio.Group
        buttonStyle="solid"
        onChange={this.onChange}
        className="switch-wrap"
      >
        {optionsValue.map(item => (
          <Radio.Button value={item.value} key={item.value}>
            {item.label}
          </Radio.Button>
        ))}
        {/* <span className="switch-btn">
          {value && value !== '0' ? '启用' : '禁用'}
        </span> */}
      </Radio.Group>
    )
  }
}
