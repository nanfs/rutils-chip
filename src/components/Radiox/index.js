import React from 'react'
import { Radio, Icon, InputNumber, Button } from 'antd'
import classnames from 'classnames'
import './index.less'

export default class Radiox extends React.Component {
  state = {
    value: undefined,
    options: this.props.options || [],
    expand: false
  }

  componentDidUpdate(prep) {
    if (this.props.value !== prep.value) {
      this.setState({ value: this.props.value })
    }
  }

  handleChange = e => {
    const value = e.target ? e.target.value : e
    this.setState({ value })
    this.props.onChange(value)
  }

  toggle = () => {
    this.setState({ expand: !this.state.expand })
  }

  renderOptions = () => {
    const { options } = this.props
    const { expand } = this.state
    if (!options || !options.length) {
      return <span>暂无数据</span>
    }
    if (expand) {
      return options.map(item => (
        <Radio.Button
          value={item.value}
          key={item.value}
          disabled={item.disabled}
        >
          {item.label}
        </Radio.Button>
      ))
    }
    const someOptions = options.slice(0, 8)
    return someOptions.map(item => (
      <Radio.Button
        value={item.value}
        key={item.value}
        disabled={item.disabled}
      >
        {item.label}
      </Radio.Button>
    ))
  }

  render() {
    const {
      className,
      hasInputNumber,
      loading,
      getData,
      numProps,
      disabled,
      options
    } = this.props
    const { expand } = this.state
    const cls = classnames(className, 'radiox', getData && 'has-fresh')
    return (
      <Radio.Group
        className={cls}
        disabled={disabled}
        onChange={this.handleChange}
        value={this.state.value}
      >
        {this.renderOptions()}
        {hasInputNumber && (
          <InputNumber
            placeholder=""
            min={numProps.min}
            max={numProps.max}
            disabled={disabled}
            onChange={this.handleChange}
            value={this.state.value}
          />
        )}
        {options && options.length > 8 && (
          <Button
            className="expand-btn"
            onClick={this.toggle}
            disabled={disabled}
            icon={expand ? 'up' : 'down'}
          >
            {expand ? '折叠隐藏' : '展开更多'}
          </Button>
        )}
        {getData && (
          <Button className="reload-btn" disabled={disabled} onClick={getData}>
            <Icon type="sync" spin={loading}></Icon>
          </Button>
        )}
      </Radio.Group>
    )
  }
}
