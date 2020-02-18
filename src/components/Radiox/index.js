import React from 'react'
import { Radio, Button } from 'antd'

export default class Radiox extends React.Component {
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
    const { className, options = [], onRefresh } = this.props
    return (
      <Radio.Group
        className={className}
        onChange={this.handleChange}
        value={this.state.value}
      >
        {!options.length && <span>暂无数据</span>}
        {options.map(item => (
          <Radio.Button
            value={item.value}
            key={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </Radio.Button>
        ))}
        {onRefresh && <Button onClick={onRefresh} icon="refresh"></Button>}
      </Radio.Group>
    )
  }
}
