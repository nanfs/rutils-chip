import React from 'react'
import { Radio, Icon, InputNumber, Button } from 'antd'
import classnames from 'classnames'
import './index.less'

export default class Radiox extends React.Component {
  componentDidUpdate(prep) {
    if (this.props.value !== prep.value) {
      this.setState({ value: this.props.value })
    }
  }

  handleChange = e => {
    const value = e?.target ? e.target.value : e
    this.setState({ value })
    this.props.onChange(value)
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

  toggle = () => {
    this.setState({ expand: !this.state?.expand })
  }

  renderOptions = () => {
    const { options, showExpand } = this.props
    if (!options || !options.length) {
      return <span>暂无数据</span>
    }
    if (this.state?.expand || !showExpand) {
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
      options,
      showExpand
    } = this.props
    const cls = classnames(className, 'radiox', getData && 'has-fresh')
    return (
      <Radio.Group
        className={cls}
        disabled={disabled}
        onChange={this.handleChange}
        value={this.state?.value}
      >
        {this.renderOptions()}
        {hasInputNumber && (
          <InputNumber
            placeholder=""
            {...numProps}
            disabled={disabled}
            onChange={this.handleChange}
            value={this.state?.value}
            formatter={value => `${value}`}
            parser={value => value}
          />
        )}
        {showExpand && options && options.length > 8 && (
          <Button
            className="expand-btn"
            onClick={this.toggle}
            disabled={disabled}
            icon={this.state?.expand ? 'up' : 'down'}
          >
            {this.state?.expand ? '折叠隐藏' : '展开更多'}
          </Button>
        )}
        {getData && (
          <Button
            className="reload-btn"
            disabled={disabled || this.state?.loading}
            onClick={this.handleGetData}
          >
            <Icon type="sync" spin={loading || this.state?.loading}></Icon>
          </Button>
        )}
      </Radio.Group>
    )
  }
}
