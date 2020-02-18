import React from 'react'
import { Select, Button } from 'antd'

const { Option } = Select
export default class Selectx extends React.Component {
  state = {
    value: undefined
  }

  componentDidUpdate(prep) {
    if (this.props.value !== prep.value && prep.value === undefined) {
      this.setState({ value: this.props.value })
    }
  }

  handleChange = value => {
    this.setState({ value })
    this.props.onChange(value)
  }

  render() {
    const {
      className,
      options = [],
      onRefresh,
      mode = '',
      placeholder = '请选择'
    } = this.props
    return (
      <Select
        className={className}
        mode={mode}
        placeholder={placeholder}
        onChange={this.handleChange}
        value={this.state.value}
      >
        {!options.length && (
          <Option value={''} key={'no-data'} disabled={true}>
            暂无数据
          </Option>
        )}
        {options.length &&
          options.map(item => (
            <Option
              value={item.value}
              key={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </Option>
          ))}
        {onRefresh && <Button onClick={onRefresh} icon="refresh"></Button>}
      </Select>
    )
  }
}
