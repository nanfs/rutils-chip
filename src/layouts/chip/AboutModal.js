import React from 'react'
import Modalx, { createModalCfg } from '@/components/Modalx'
import { Row, Col } from 'antd'
import './index.scss'

const src = require('@/assets/logo.png')

export default class AboutModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = () => {
    this.modal.show()
  }

  render() {
    const modalCfg = createModalCfg({
      title: '关于',
      width: 738,
      hasFooter: false
    })

    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        className="about-modal"
        modalCfg={modalCfg}
        // onOk={this.onOk}
      >
        {/* <Row>
          <Col span={24} className="about-logo">
            <img src={src} />
          </Col>
        </Row> */}
        <Row gutter={32} className="row-margin">
          <Col span={5} className="about-title">
            系统编号 :
          </Col>
          <Col span={19}>3F2504E0-4F89-11D3-9A0C-0305E82C3301</Col>
        </Row>
        <Row gutter={32} className="row-margin">
          <Col span={5} className="about-title">
            版本号 :
          </Col>
          <Col span={19}>V2.0.0 build 01108</Col>
        </Row>
        <Row gutter={32} className="row-margin">
          <Col span={5} className="about-title">
            许可数量 :
          </Col>
          <Col span={19}>1000</Col>
        </Row>
        <Row gutter={32} className="row-margin">
          <Col span={5} className="about-title">
            许可证有效期 :
          </Col>
          <Col span={19}>2020年12月31日</Col>
        </Row>
        <Row>
          <Col span={24} className="about-logo">
            <img src={src} />
          </Col>
        </Row>
        <Row>
          <Col span={24} className="about-info">
            2020-CETC-cloud 电科云（北京）科技有限公司
          </Col>
        </Row>
      </Modalx>
    )
  }
}
