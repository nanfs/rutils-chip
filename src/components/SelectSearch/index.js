import React, { useState } from 'react'
import { Select, Input } from 'antd'

const { Search } = Input
function SelectSearch(props) {
  const { placeholder, onSearch, options } = props
  const defaultValue = options && options[0] && options[0].value
  const [searchKey, setSearchKey] = useState(defaultValue)
  return (
    <div>
      <Select onChange={key => setSearchKey(key)} defaultValue={defaultValue}>
        {options &&
          options.map(option => (
            <Select.Option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </Select.Option>
          ))}
      </Select>
      <Search
        placeholder={placeholder || '请输入'}
        onSearch={value => onSearch(searchKey, value)}
        enterButton
      />
    </div>
  )
}

export default SelectSearch
