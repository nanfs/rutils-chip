import React from 'react'
import { Radio, Button } from 'antd'

export default class Radiox extends React.Component {
  render() {
    const {
      className,
      options = [],
      onRefresh,
      defaultVal = '',
      onChange = undefined
    } = this.props
    return (
      <Radio.Group
        className={className}
        defaultValue={defaultVal}
        onChange={onChange}
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
