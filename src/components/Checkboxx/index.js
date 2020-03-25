import React from 'react'
import { Icon, InputNumber, Button, Checkbox } from 'antd'
import classnames from 'classnames'
import './index.less'

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

  handleGetData = async () => {
    const { getData } = this.props
    this.setState({ loading: true })
    try {
      await getData()
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  renderOptions = () => {
<<<<<<< HEAD
    const { options, showExpand } = this.props
    const { expand } = this.state
    if (!options || !options.length) {
      return <span>暂无数据</span>
    }
    if (expand || !showExpand) {
=======
    const { options } = this.props
    if (!options || !options.length) {
      return <span>暂无数据</span>
    }
    if (this.state?.expand) {
>>>>>>> af2c21f... [公共组件] 修改checkboxx radiox selectx异步操作
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
    const {
      className,
      hasInputNumber,
      loading,
      getData,
      disabled,
      options
    } = this.props
    const cls = classnames(className, 'radiox', getData && 'has-fresh')
    console.log(this.state?.loading)
    return (
      <Checkbox.Group
        className={cls}
        disabled={disabled}
        onChange={this.handleChange}
        value={this.state?.value}
      >
        {this.renderOptions()}
        {hasInputNumber && (
          <InputNumber
            placeholder=""
            disabled={disabled}
            onChange={this.handleChange}
            value={this.state?.value}
          />
        )}
        {options && options.length > 8 && (
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
            disabled={this.state?.loading || disabled}
            onClick={this.handleGetData}
          >
            <Icon type="sync" spin={loading || this.state?.loading}></Icon>
          </Button>
        )}
      </Checkbox.Group>
    )
  }
}
