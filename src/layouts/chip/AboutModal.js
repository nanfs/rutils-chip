import React from 'react'
import { Modalx } from '@/components'
import { Row, Col } from 'antd'
import './index.less'
import { getItemFromLocal } from '@/utils/storage'

const src = require('@/assets/logo.png')

const { createModalCfg } = Modalx
export default class AboutModal extends React.Component {
  state = { version: 'V1.5.0', build: '3567' }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.setState({ version: getItemFromLocal('version') })
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
    const { version, build } = this.state

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
          <Col span={19}>
            {version} build {build}
          </Col>
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
            版权所有©2020 电科云（北京）科技有限公司
          </Col>
        </Row>
      </Modalx>
    )
  }
}
