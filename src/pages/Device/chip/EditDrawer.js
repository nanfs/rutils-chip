import React from 'react'
import { Form, Input, Switch, Icon, Row, Col } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title, { Diliver } from '@/components/Title'
import deviceApi from '@/services/device'
import '../index.scss'

const { TextArea } = Input
let id = 1000

class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  remove = k => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')

    if (keys.length === 1) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }

  add = () => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(id++)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    })
  }

  updateSubmit = values => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const usbs = []
    keys.forEach(function(v, i) {
      usbs.push({
        name: document.getElementById(`names[${v}]`).value,
        vid: document.getElementById(`vids[${v}]`).value,
        pid: document.getElementById(`pids[${v}]`).value
      })
    })
    values.usbs = usbs
    if (
      values.isUsagePeripherals == undefined ||
      values.isUsagePeripherals == false
    ) {
      values.isUsagePeripherals = '0'
    } else {
      values.isUsagePeripherals = '1'
    }
    console.log(values)
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { initValues } = this.props
    getFieldDecorator('keys', { initialValue: initValues.initKeys || [] })
    const keys = getFieldValue('keys')
    const formItems3 = keys.map((k, index) => (
      <Row gutter={16} key={k} className="form-item-wrapper">
        <Col span={7}>
          <Form.Item>
            {getFieldDecorator(`names[${k}]`, {
              initialValue: initValues.usbs[k] ? initValues.usbs[k].name : ''
            })(<Input placeholder="名称" />)}
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item>
            {getFieldDecorator(`vids[${k}]`, {
              initialValue: initValues.usbs[k] ? initValues.usbs[k].vid : ''
            })(<Input placeholder="VendorId" />)}
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item>
            {getFieldDecorator(`pids[${k}]`, {
              initialValue: initValues.usbs[k] ? initValues.usbs[k].pid : ''
            })(<Input placeholder="ProductId" />)}
          </Form.Item>
        </Col>
        {keys.length > 1 ? (
          <Col span={3}>
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
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
              type="plus-circle"
              onClick={this.add}
              style={{ marginLeft: 8 }}
            />
          </Col>
        )}
      </Row>
    ))
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => this.updateSubmit(values)}
      >
        <Formx
          onRef={ref => {
            this.formx = ref
          }}
          initValues={initValues}
        >
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="名称" required>
            <Input name="name" placeholder="名称" />
          </Form.Item>
          <Form.Item prop="isUsagePeripherals" label="USB外设" required>
            <Switch
              name="isUsagePeripherals"
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
          <Title slot="外设设置"></Title>
          <Row gutter={16} className="form-item-wrapper">
            <Col span={7}>
              <Form.Item label="名称" required></Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="VendorId" required></Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="ProductId" required></Form.Item>
            </Col>
          </Row>
          {formItems3}
        </Formx>
      </Drawerx>
    )
  }
}

const WrappedEditDrawer = Form.create()(EditDrawer)

export default WrappedEditDrawer