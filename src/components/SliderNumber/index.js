import React from 'react'
import { Slider, InputNumber, Row, Col } from 'antd'

class SliderNumber extends React.Component {
  componentDidMount() {}

  state = {
    inputValue: this.props.inputValue
  }

  onChange = value => {
    this.setState({
      inputValue: value
    })
  }

  render() {
    const { inputValue } = this.state
    return (
      <Row value={inputValue}>
        <Col span={18}>
          <Slider
            min={1}
            max={20}
            onChange={this.onChange}
            value={typeof inputValue === 'number' ? inputValue : 0}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={1}
            max={20}
            style={{ marginLeft: 16 }}
            value={inputValue}
            onChange={this.onChange}
          />
        </Col>
      </Row>
    )
  }
}
export default SliderNumber
