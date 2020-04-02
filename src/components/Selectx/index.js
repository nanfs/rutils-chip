import React from 'react'
import classnames from 'classnames'
import { Select, Button, Icon } from 'antd'
import './index.less'

const { Option } = Select
export default class Selectx extends React.Component {
  componentDidUpdate(prep) {
    if (this.props.value !== prep.value) {
      this.setState({ value: this.props.value })
    }
  }

  handleGetData = async () => {
    this.setState({ loading: true })
    const { getData } = this.props
    try {
      await getData()
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
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
      mode = '',
      getData,
      disabled,
      style,
      children,
      placeholder = '请选择'
    } = this.props
    const cls = classnames(className, 'selectx', getData && 'has-fresh')
    return (
      <React.Fragment>
        <Select
          className={cls}
          mode={mode}
          style={style}
          disabled={disabled}
          placeholder={placeholder}
          onChange={this.handleChange}
          value={this.state?.value}
        >
          {children}
          {options?.map(item => (
            <Option
              value={item.value}
              key={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </Option>
          ))}
        </Select>
        {getData && (
          <Button
            className="reload-btn"
            disabled={disabled || this.state?.loading}
            onClick={this.handleGetData}
          >
            <Icon type="sync" spin={this.state?.loading}></Icon>
          </Button>
        )}
      </React.Fragment>
    )
  }
}
