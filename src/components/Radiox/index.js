import React from 'react'
import { Radio, Icon, InputNumber, Button } from 'antd'
import classnames from 'classnames'
import './index.scss'

export default class Radiox extends React.Component {
  state = {
    value: undefined,
    options: this.props.options || []
  }

  componentDidMount() {
    const { getOptionFunction } = this.props
    if (getOptionFunction) {
      this.getData()
    }
  }

  componentDidUpdate(prep) {
    // if (this.props.value !== prep.value && prep.value === undefined) {
    if (this.props.value !== prep.value) {
      this.setState({ value: this.props.value })
    }
  }

  handleChange = e => {
    const value = e.target ? e.target.value : e
    this.setState({ value })
    this.props.onChange(value)
  }

  // getOptionFucntion 传入获取选项方法  param传入参数
  getData = () => {
    const { getOptionFunction, param } = this.props
    this.setState({ loading: true })
    getOptionFunction(param)
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          this.setState({ options: res.data, loading: false })
        } else {
          this.setState({ loading: false })
          console.log(res)
        }
      })
      .catch(err => {
        this.setState({ loading: false })
        console.log(err)
      })
  }

  render() {
    const { className, hasInputNumber, getOptionFunction } = this.props
    const { options, loading } = this.state
    const cls = classnames(
      className,
      'radiox',
      getOptionFunction && 'has-fresh'
    )
    return (
      <Radio.Group
        className={cls}
        onChange={this.handleChange}
        value={this.state.value}
      >
        {!options.length && <span>暂无数据</span>}
        {options &&
          options.map(item => (
            <Radio.Button
              value={item.value}
              key={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </Radio.Button>
          ))}
        {hasInputNumber && (
          <InputNumber
            placeholder=""
            onChange={this.handleChange}
            value={this.state.value}
          />
        )}
        {!!getOptionFunction && (
          <Button className="reload-btn" onClick={this.getData}>
            <Icon type="sync" spin={loading}></Icon>
          </Button>
        )}
      </Radio.Group>
    )
  }
}
