import React from 'react'
import { Form, Input, Switch, Icon, Row, Col, notification } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title, { Diliver } from '@/components/Title'
import deviceApi from '@/services/device'
import '../index.scss'

const { TextArea } = Input
export default class AddDrawer extends React.Component {
  state = {}

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  componentDidUpdate(props, state) {
    if (JSON.stringify(this.state) !== JSON.stringify(state)) {
      this.setValues()
    }
  }

  setValues = () => {
    const { id, name, usagePeripherals, description, usbs } = this.state
    const usbsObj = {}
    usbs.forEach((item, index) => {
      usbsObj[`usbname[${index}]`] = item.name
      usbsObj[`usbpid[${index}]`] = item.pid
      usbsObj[`usbvid[${index}]`] = item.vid
    })
    this.drawer.form.setFieldsValue({
      id,
      name,
      usagePeripherals: usagePeripherals !== '0',
      description,
      ...usbsObj
    })
  }

  pop = () => {
    this.drawer.show()
    this.setState({ usbs: [{ name: '', pid: '', vid: '' }] })
  }

  getUsbs = () => {
    const data = this.drawer.form.getFieldsValue()
    const { usbname, usbvid, usbpid } = data
    const usbs = []
    usbname.forEach((item, index) => {
      usbs.push({
        name: usbname[index],
        vid: usbvid[index],
        pid: usbpid[index]
      })
    })
    return usbs
  }

  remove = k => {
    const usbs = this.getUsbs()
    const newUsbs = [...usbs.slice(0, k), ...usbs.slice(k + 1)]
    this.setState({
      ...this.state,
      usbs: newUsbs
    })
  }

  add = () => {
    const usbs = this.getUsbs()
    this.setState({
      ...this.state,
      usbs: [...usbs, []]
    })
  }

  addDev = values => {
    const usbs = this.getUsbs()
    const { id, name, description, usagePeripherals: usageFix } = values
    const usagePeripherals = usageFix ? '1' : '0'
    deviceApi
      .addDev({ id, name, description, usagePeripherals, usbs })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  renderUsb = () => {
    const { usbs } = this.state
    return (
      usbs &&
      usbs.map((item, index) => (
        <Row gutter={16} key={index} className="form-item-wrapper">
          <Col span={7}>
            <Form.Item prop={`usbname[${index}]`}>
              <Input placeholder="名称" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item prop={`usbpid[${index}]`}>
              <Input placeholder="VendorId" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item prop={`usbvid[${index}]`}>
              <Input placeholder="ProductId" />
            </Form.Item>
          </Col>
          {index === usbs.length - 1 ? (
            <Col span={3}>
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={index === 0}
                onClick={() => this.remove(index)}
              />
              <Icon
                className="dynamic-delete-button"
                type="plus-circle"
                onClick={this.add}
                style={{ marginLeft: 8 }}
              />
            </Col>
          ) : (
            <Col span={3}>
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(index)}
              />
            </Col>
          )}
        </Row>
      ))
    )
  }

  render() {
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onSuccess={this.props.onSuccess}
        onOk={this.addDev}
        onClose={this.onClose}
      >
        <Formx
          onRef={ref => {
            this.formx = ref
          }}
        >
          <Title slot="基础设置"></Title>
          <Form.Item prop="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="name" label="名称" required>
            <Input name="name" placeholder="名称" />
          </Form.Item>
          <Form.Item
            label="USB外设"
            required
            prop="usagePeripherals"
            valuepropname="checked"
          >
            <Switch
              name="usagePeripherals"
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea
              style={{ resize: 'none' }}
              rows={4}
              name="description"
              placeholder="描述"
            />
          </Form.Item>
          <Diliver />
          <Title slot="特例设置"></Title>
          <Row gutter={16} className="form-item-wrapper">
            <Col span={7}>
              <Form.Item label="名称"></Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="VendorId"></Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="ProductId"></Form.Item>
            </Col>
          </Row>
          {this.renderUsb()}
        </Formx>
      </Drawerx>
    )
  }
}
