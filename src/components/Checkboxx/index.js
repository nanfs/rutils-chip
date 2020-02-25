import React from 'react'
import { Icon, InputNumber, Button, Checkbox } from 'antd'
import classnames from 'classnames'
import './index.scss'

export default class Checkboxx extends React.Component {
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
        <Checkbox value={item.value} key={item.value} disabled={item.disabled}>
          {item.label}
        </Checkbox>
      ))
    }
    const someOptions = options.slice(0, 8)
    return someOptions.map(item => (
      <Checkbox value={item.value} key={item.value} disabled={item.disabled}>
        {item.label}
      </Checkbox>
    ))
  }

  render() {
    const { className, hasInputNumber, loading, getData } = this.props
    const { options, expand } = this.state
    const cls = classnames(className, 'radiox', getData && 'has-fresh')
    return (
      <Checkbox.Group
        className={cls}
        onChange={this.handleChange}
        value={this.state.value}
      >
        {this.renderOptions()}
        {hasInputNumber && (
          <InputNumber
            placeholder=""
            onChange={this.handleChange}
            value={this.state.value}
          />
        )}
        {options && options.length > 8 && (
          <Button
            className="expand-btn"
            onClick={this.toggle}
            icon={expand ? 'up' : 'down'}
          >
            {expand ? '折叠隐藏' : '展开更多'}
          </Button>
        )}
        {getData && (
          <Button className="reload-btn" onClick={getData}>
            <Icon type="sync" spin={loading}></Icon>
          </Button>
        )}
      </Checkbox.Group>
    )
  }
}
