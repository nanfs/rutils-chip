import React, { useState } from 'react'
import { Select, Input, Row, Col } from 'antd'

const { Search, Group } = Input
function SelectSearch(props) {
  const { placeholder, onSearch, options } = props
  const defaultValue = options && options[0] && options[0].value
  const [searchKey, setSearchKey] = useState(defaultValue)
  return (
    <Group compact className="select-search">
      <Row>
        <Col span={6}>
          <Select
            onChange={key => setSearchKey(key)}
            defaultValue={defaultValue}
          >
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
        </Col>
        <Col span={18}>
          <Search
            placeholder={placeholder || '请输入'}
            onSearch={value => onSearch(searchKey, value)}
            enterButton
          />
        </Col>
      </Row>
    </Group>
  )
}

export default SelectSearch
