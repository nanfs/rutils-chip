import React from 'react'
import Modalx, { createModalCfg } from '@/components/Modalx'
import { Spin, Row, Col } from 'antd'
import './index.scss'
import appApi from '@/services/app'

const src = require('@/assets/logo.png')

export default class AboutModal extends React.Component {
  state = {
    aboutinfo: {}
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    appApi.getAboutinfo().then(res => {
      this.setState({ aboutinfo: res.data })
    })
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
    const { aboutinfo } = this.state

    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        className="about-modal"
        modalCfg={modalCfg}
        onOk={this.onOk}
      >
        {/* <Spin spinning={aboutinfo.loading}> */}
        {/* {aboutinfo.data && ( */}
        <Row>
          <Col span={24} className="about-logo">
            <img src={src} />
          </Col>
        </Row>
        <Row gutter={32} className="row-margin">
          <Col span={11} className="about-title">
            系统编号 :
          </Col>
          <Col span={13}>sdfsdf</Col>
          {/* <Col span={13}>{aboutinfo.data.systemNumber}</Col> */}
        </Row>
        <Row gutter={32} className="row-margin">
          <Col span={11} className="about-title">
            产品类型 :
          </Col>
          <Col span={13}>sdfsdf</Col>
          {/* <Col span={13}>{aboutinfo.data.productType}</Col> */}
        </Row>
        <Row gutter={32} className="row-margin">
          <Col span={11} className="about-title">
            许可数量 :
          </Col>
          <Col span={13}>sdfsdf</Col>
          {/* <Col span={13}>{aboutinfo.data.permitNumber}</Col> */}
        </Row>
        <Row gutter={32} className="row-margin">
          <Col span={11} className="about-title">
            许可证有效期 :
          </Col>
          <Col span={13}>sdfsdf</Col>
          {/* <Col span={13}>{aboutinfo.data.useTimeLimit}</Col> */}
        </Row>
        {/* )} */}
        <Row>
          <Col span={24} className="about-info">
            2020-CETC-cloud 电科云（北京）科技有限公司
          </Col>
        </Row>
        {/* </Spin> */}
      </Modalx>
    )
  }
}
