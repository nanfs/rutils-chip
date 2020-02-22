import React from 'react'
import { Radio, Icon, InputNumber, Button, Row, Col } from 'antd'
import classnames from 'classnames'
import './index.scss'

export default class Radiox extends React.Component {
  state = {
    value: undefined,
    options: this.props.options || [],
    expand: false
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
    const { getOptionFunction, param, keys = ['id', 'name'] } = this.props
    this.setState({ loading: true })
    getOptionFunction(param)
      .then(res => {
        if (res.success && Array.isArray(res.data.records)) {
          const options = res.data.records.map(item => ({
            label: item[keys[1]],
            value: item[keys[0]]
          }))
          this.setState({ options, loading: false })
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

  toggle = () => {
    this.setState({ expand: !this.state.expand })
  }

  renderOptions = () => {
    const { getOptionFunction } = this.props
    const { options, expand } = this.state
    if (!options.length) {
      return <span>暂无数据</span>
    }
    if (!getOptionFunction || expand) {
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
    if (!expand) {
      const someOptions = options.slice(0, 8)
      return (
        // <Row>
        someOptions.map(item => (
          // <Col span={6} key={index}>
          <Radio.Button
            value={item.value}
            key={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </Radio.Button>
          // </Col>
        ))
        // </Row>
      )
    }
    console.log('catch renderOptions', expand, options)
  }

  render() {
    const { className, hasInputNumber, getOptionFunction } = this.props
    const { options, loading, expand } = this.state
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
        {this.renderOptions()}
        {hasInputNumber && (
          <InputNumber
            placeholder=""
            onChange={this.handleChange}
            value={this.state.value}
          />
        )}
        {!!getOptionFunction && options && options.length > 8 && (
          <Button
            className="expand-btn"
            onClick={this.toggle}
            icon={expand ? 'up' : 'down'}
          >
            {expand ? '折叠隐藏' : '展开更多'}
          </Button>
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
