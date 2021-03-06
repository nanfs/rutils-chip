import React from 'react'
import { Select, Input } from 'antd'

const { Search, Group } = Input
class SelectSearch extends React.Component {
  state = {
    value: this.props?.defaultValue || '',
    searchKey: this.props?.options[0]?.value || ''
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  reset() {
    const { options } = this.props
    const searchKey = (options && options[0] && options[0].value) || ''
    this.setState({
      value: '',
      searchKey
    })
  }

  /**
   * oldKey 是为了删除搜索字段
   *
   * @memberof SelectSearch
   */
  onSelectChange = searchKey => {
    const { onSearch } = this.props
    const oldKey = this.state.searchKey
    this.setState({ searchKey })
    this.props.onSelectChange && this.props.onSelectChange(oldKey, searchKey)
    onSearch && onSearch(searchKey, this.state?.value)
  }

  onChange = e => {
    this.setState({ value: e.target.value })
  }

  onSearch = value => {
    const { onSearch } = this.props
    onSearch && onSearch(this.state?.searchKey, value)
  }

  render() {
    const { placeholder, options } = this.props
    const { searchKey, value } = this.state
    return (
      <Group className="select-search">
        <Select onChange={key => this.onSelectChange(key)} value={searchKey}>
          {options &&
            options.map(option => (
              <Select.Option
                key={option.value}
                value={option.value}
                title={option.label}
                disabled={option.disabled}
              >
                {option.label}
              </Select.Option>
            ))}
        </Select>
        <Search
          placeholder={placeholder || '请输入'}
          onSearch={this.onSearch}
          onChange={this.onChange}
          value={value}
          enterButton
        />
      </Group>
    )
  }
}

export default SelectSearch
