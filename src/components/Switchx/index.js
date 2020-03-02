import React from 'react'
import { Radio } from 'antd'
import './index.scss'

export default class Switchx extends React.Component {
  state = {
    value: undefined
  }

  componentDidUpdate(prep) {
    if (this.props.value !== prep.value && prep.value === undefined) {
      this.setState({ value: this.props.value })
    }
  }

  handleChange = e => {
    this.setState({ value: e.target.value })
    this.props.onChange(e.target.value)
  }

  render() {
    const { options, disabled } = this.props
    const optionsValue = options || [
      { label: 'on', value: 'on' },
      { label: 'off', value: 'off' }
    ]
    return (
      <Radio.Group
        disabled={disabled}
        buttonStyle="solid"
        onChange={this.handleChange}
        value={this.state.value}
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
