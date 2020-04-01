import React from 'react'
import { Form, Input, Switch, Icon, Row, Col, notification } from 'antd'
import { Drawerx, Formx, Title, Diliver } from '@/components'
import deviceApi from '@/services/device'
import '../index.less'
import { required, checkName, number4, number5 } from '@/utils/valid'

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
    const { id, name, description, usbs, usageFix } = this.state
    const usbsObj = {}
    usbs.forEach((item, index) => {
      usbsObj[`usbname[${index}]`] = item.name
      usbsObj[`usbpid[${index}]`] = item.pid
      usbsObj[`usbvid[${index}]`] = item.vid
    })
    console.log(this.drawer)
    this.drawer.form.setFieldsValue({
      id,
      name,
      usageFix,
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
      ...this.drawer.form.getFieldsValue(),
      usbs: newUsbs
    })
  }

  add = index => {
    const usbs = this.getUsbs()
    if (index >= 9) {
      notification.warn({ message: '特例最多允许添加10条' })
      return
    }
    if (usbs[index].name === '' || usbs[index].name === undefined) {
      notification.warn({ message: '请完善特例名称' })
      return
    }
    if (usbs[index].vid === '' || usbs[index].vid === undefined) {
      notification.warn({ message: '请完善特例VendorId' })
      return
    }
    if (usbs[index].pid === '' || usbs[index].pid === undefined) {
      notification.warn({ message: '请完善特例ProductId' })
      return
    }
    this.setState({
      ...this.state,
      ...this.drawer.form.getFieldsValue(),
      usbs: [...usbs, []]
    })
  }

  addDev = values => {
    let usbs = this.getUsbs()
    if (usbs.length === 1) {
      if (
        usbs[0].name == '' ||
        usbs[0].name == undefined ||
        usbs[0].vid == '' ||
        usbs[0].vid == undefined ||
        usbs[0].pid == '' ||
        usbs[0].pid == undefined
      ) {
        // notification.warn({ message: '请至少添加一例特例' })
        usbs = undefined
      }
    } else if (
      usbs[usbs.length - 1].name == '' ||
      usbs[usbs.length - 1].name == undefined ||
      usbs[usbs.length - 1].vid == '' ||
      usbs[usbs.length - 1].vid == undefined ||
      usbs[usbs.length - 1].pid == '' ||
      usbs[usbs.length - 1].pid == undefined
    ) {
      // notification.warn({ message: '请完善特例' })
      usbs = usbs.slice(0, usbs.length - 1) // 去掉最后一项
    }
    const { id, name, description, usageFix } = values
    const usagePeripherals = usageFix ? '1' : '0'
    deviceApi
      .addDev({ id, name, description, usagePeripherals, usbs })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
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
            <Form.Item prop={`usbname[${index}]`} rules={[checkName]}>
              <Input placeholder="名称" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item prop={`usbvid[${index}]`} rules={[number4]}>
              <Input placeholder="VendorId" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item prop={`usbpid[${index}]`} rules={[number4]}>
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
                onClick={() => this.add(index)}
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
        onClose={this.props.onClose}
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
          <Form.Item
            prop="name"
            label="名称"
            required
            rules={[checkName, required]}
          >
            <Input name="name" placeholder="名称" />
          </Form.Item>
          <Form.Item
            label="USB外设"
            required
            prop="usageFix"
            valuepropname="checked"
          >
            <Switch
              name="usageFix"
              checkedChildren="启用白名单"
              unCheckedChildren="启用黑名单"
            />
          </Form.Item>
          <Form.Item prop="description" label="描述" rules={[number5]}>
            <TextArea
              style={{ resize: 'none' }}
              rows={4}
              name="description"
              placeholder="描述"
            />
          </Form.Item>
          <Diliver />
          <Title slot="名单设置"></Title>
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
