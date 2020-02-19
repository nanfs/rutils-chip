import React from 'react'
import appApi from '@/services/app'
import Modalx, { createModalCfg } from '@/components/Modalx'
import Formx from '@/components/Formx'
import TitleInfo from '@/components/Title/TitleInfo'
import { Form, Input, Row, Col, Slider, InputNumber, Switch } from 'antd'
import { scrollToAnchor } from '@/utils/tool'
import './index.scss'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7, pull: 1 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}

export default class ConfigModal extends React.Component {
  state = {
    inputValue: 1,
    inputValue2: 1,
    inputValue3: 1,
    inputValue4: 1,
    activeList: 'sysLink'
  }

  onChange = value => {
    this.setState({
      inputValue: value
    })
  }

  onChange2 = value => {
    this.setState({
      inputValue2: value
    })
  }

  onChange3 = value => {
    this.setState({
      inputValue3: value
    })
  }

  onChange4 = value => {
    this.setState({
      inputValue4: value
    })
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  getResult = values => {
    return new Promise(resolve => {
      setTimeout(() => {
        appApi.updateConfig(values).then(res => {
          console.log(res)
          resolve(res)
        })
      }, 1000)
    })
  }

  pop = () => {
    this.modal.show()
  }

  onOk = values => {
    console.log(values)
    // this.getResult().then(res => this.modal.afterSubmit(res))
  }

  anchorClick = key => {
    scrollToAnchor(key)
    this.setState({ activeList: key })
  }

  render() {
    const modalCfg = createModalCfg({ title: '系统设置', width: '60%' })
    const {
      inputValue,
      inputValue2,
      inputValue3,
      inputValue4,
      activeList
    } = this.state

    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
        className="sys-modal"
      >
        <Formx formItemLayout={formItemLayout}>
          <Row id="configContainer" gutter={32}>
            <Col span={4} style={{ position: 'fixed' }}>
              <ul className="sys-anchor">
                <li
                  name="sysLink"
                  className={activeList === 'sysLink' ? 'active' : ''}
                  onClick={() => this.anchorClick('sysLink')}
                >
                  系统参数
                </li>
                <li
                  name="desktopLink"
                  className={activeList === 'desktopLink' ? 'active' : ''}
                  onClick={() => this.anchorClick('desktopLink')}
                >
                  桌面参数
                </li>
                <li
                  name="terminalLink"
                  className={activeList === 'terminalLink' ? 'active' : ''}
                  onClick={() => this.anchorClick('terminalLink')}
                >
                  终端参数
                </li>
              </ul>
            </Col>
            <Col
              span={20}
              push={4}
              style={{ backgroundColor: '#fff', padding: '26px 20px' }}
            >
              <div id="sysLink">
                <TitleInfo slot="系统参数" />
                <Form.Item
                  style={{
                    borderTop: '1px solid #ccc',
                    marginTop: '8px',
                    paddingTop: '14px'
                  }}
                  prop="sessionTimeOutInterval"
                  label="会话超时时间"
                >
                  <Row>
                    <Col span={18}>
                      <Slider
                        min={1}
                        max={5}
                        onChange={this.onChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                      />
                    </Col>
                    <Col span={4}>
                      <InputNumber
                        min={1}
                        max={5}
                        style={{ marginLeft: 16 }}
                        value={inputValue}
                        onChange={this.onChange}
                      />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item
                  prop="userLoginFailMaxTimes"
                  label="登录失败最大次数"
                >
                  <Row>
                    <Col span={18}>
                      <Slider
                        min={1}
                        max={5}
                        onChange={this.onChange2}
                        value={
                          typeof inputValue2 === 'number' ? inputValue2 : 0
                        }
                      />
                    </Col>
                    <Col span={4}>
                      <InputNumber
                        min={1}
                        max={5}
                        style={{ marginLeft: 16 }}
                        value={inputValue2}
                        onChange={this.onChange2}
                      />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item
                  prop="userLoginFailLockTimeThreshold"
                  label="登录失败锁定阈值"
                >
                  <Row>
                    <Col span={18}>
                      <Slider
                        min={1}
                        max={5}
                        onChange={this.onChange3}
                        value={
                          typeof inputValue3 === 'number' ? inputValue3 : 0
                        }
                      />
                    </Col>
                    <Col span={4}>
                      <InputNumber
                        min={1}
                        max={5}
                        style={{ marginLeft: 16 }}
                        value={inputValue3}
                        onChange={this.onChange3}
                      />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item prop="isAllowMultiSession" label="用户多会话">
                  <Switch
                    defaultChecked
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                  />
                </Form.Item>
                <Form.Item prop="syslogVendorCode" label="SYSLOG上报厂商代码">
                  <Input placeholder="SYSLOG上报厂商代码" />
                </Form.Item>
                <Form.Item prop="syslogServerIp" label="SYSLOG服务商地址">
                  <Input placeholder="SYSLOG服务商地址" />
                </Form.Item>
                <Form.Item prop="syslogServerPort" label="SYSLOG服务商端口">
                  <Input placeholder="SYSLOG服务商端口" />
                </Form.Item>
                <Form.Item prop="syslogProtocolType" label="SYSLOG上报协议">
                  <Input placeholder="SYSLOG上报协议" />
                </Form.Item>
              </div>

              <div id="desktopLink">
                <TitleInfo slot="桌面参数" />
                <Form.Item
                  style={{
                    borderTop: '1px solid #ccc',
                    marginTop: '8px',
                    paddingTop: '14px'
                  }}
                  prop="isOpenSpiceLimit"
                  label="SPICE客户端限制"
                >
                  <Switch
                    defaultChecked
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                  />
                </Form.Item>
              </div>

              <div id="terminalLink">
                <TitleInfo slot="终端参数" />
                <Form.Item
                  style={{
                    borderTop: '1px solid #ccc',
                    marginTop: '8px',
                    paddingTop: '14px'
                  }}
                  prop="tcSwitcherPasswordMM"
                  label="交换机共享密钥"
                >
                  <Input placeholder="交换机共享密钥" type="password" />
                </Form.Item>
                <Form.Item prop="tcAutoLockTime" label="终端自动锁屏时间">
                  <Row>
                    <Col span={18}>
                      <Slider
                        min={1}
                        max={5}
                        onChange={this.onChange4}
                        value={
                          typeof inputValue4 === 'number' ? inputValue4 : 0
                        }
                      />
                    </Col>
                    <Col span={4}>
                      <InputNumber
                        min={1}
                        max={5}
                        style={{ marginLeft: 16 }}
                        value={inputValue4}
                        onChange={this.onChange4}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Formx>
      </Modalx>
    )
  }
}
