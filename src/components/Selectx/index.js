import React from 'react'
import { Select, Button } from 'antd'

const { Option } = Select
export default class Selectx extends React.Component {
  render() {
    const {
      className,
      options = [],
      onRefresh,
      mode = '',
      placeholder = '请选择',
      onChange = undefined
    } = this.props
    return (
      <Select
        className={className}
        mode={mode}
        placeholder={placeholder}
        onChange={onChange}
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
