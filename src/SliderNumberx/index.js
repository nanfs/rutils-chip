import React from 'react'
import { Slider, InputNumber, Row, Col } from 'antd'

import './index.less'

export default class SliderNumberx extends React.Component {
  componentDidUpdate(prep) {
    if (this.props.value !== prep.value) {
      this.setState({ value: this.props.value })
    }
  }

  handleChange = value => {
    const re = new RegExp('^(\\-)?([1-9]{1}[0-9]*|[0-9])$')
    if (re.test(value)) {
      this.setState({ value })
      this.props.onChange(value)
    }
  }

  render() {
    const {
      hasInputNumber,
      disabled,
      min,
      max,
      step,
      formatter,
      parser
    } = this.props
    return (
      <Row>
        <Col span={hasInputNumber ? 15 : 24}>
          <Slider
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            onChange={this.handleChange}
            value={this.state?.value}
          />
        </Col>
        <Col span={8} push={1} hidden={!hasInputNumber}>
          <InputNumber
            min={min}
            max={max}
            step={step}
            formatter={formatter}
            parser={parser}
            disabled={disabled}
            onChange={this.handleChange}
            value={this.state?.value}
          />
        </Col>
      </Row>
    )
  }
}
