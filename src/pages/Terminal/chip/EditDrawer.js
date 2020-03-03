import React from 'react'
import { Form, Input, Select } from 'antd'
import { Drawerx, Formx, Title } from '@/components'
import terminalApi from '@/services/terminal'
import { required, checkName, textRange, checkKeyId } from '@/utils/valid'

const { Option } = Select
const { TextArea } = Input

export default class EditDrawer extends React.Component {
  checkFieldRequired(fieldValue) {
    return (rule, value, callback) => {
      const loginWay = this.drawer.form.getFieldValue('loginWay')
      console.log(loginWay, value)
      if (loginWay === fieldValue && !value) {
        callback(new Error('这是必填项'))
      }
      callback()
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = data => {
    this.drawer.show()
    const {
      sn,
      name,
      description,
      loginWay,
      location,
      secretWord,
      bondKey
    } = data
    this.drawer.form.setFieldsValue({
      sn,
      name,
      description,
      loginWay,
      location,
      secretWord,
      bondKey
    })
  }

  onChange = value => {
    this.setState({
      autoLockTime: value
    })
  }

  selectChange = () => {
    this.forceUpdate()
  }

  editTerminal = values => {
    const {
      sn,
      name,
      description,
      loginWay,
      location,
      secretWord,
      bondKey
    } = values
    const data = {
      name,
      description,
      loginWay,
      location,
      secretWord: loginWay === 2 ? secretWord : '',
      bondKey: loginWay === 1 ? bondKey : ''
    }
    terminalApi
      .editTerminal(sn, data)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
        console.log(errors)
      })
  }

  render() {
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          this.editTerminal(values)
          return false
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="sn" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            prop="name"
            label="终端名称"
            required
            rules={[required, checkName, textRange(0, 63)]}
          >
            <Input placeholder="终端名称" />
          </Form.Item>
          {/* <Form.Item
            prop="autoLockTime"
            label="自动锁屏时间"
            rules={[
              {
                required: true
              }
            ]}
          >
            <Row>
              <Col span={18}>
                <Slider
                  min={1}
                  max={20}
                  onChange={this.onChange}
                  value={typeof autoLockTime === 'number' ? autoLockTime : 1}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={20}
                  style={{ marginLeft: 16 }}
                  value={autoLockTime}
                  onChange={this.onChange}
                />
              </Col>
            </Row>
            <SliderNumber autoLockTime={'1'} />
          </Form.Item> */}
          <Form.Item
            prop="location"
            label="信息位置"
            required
            rules={[required, textRange(0, 50)]}
          >
            <Input placeholder="信息位置" />
          </Form.Item>
          <Form.Item prop="loginWay" label="认证方式" rules={[required]}>
            <Select onChange={this.selectChange}>
              <Option value={1}>keyId</Option>
              <Option value={2}>安全口令</Option>
            </Select>
          </Form.Item>
          <Form.Item
            prop="bondKey"
            label="输入keyId"
            required
            rules={[this.checkFieldRequired(1), textRange(0, 64), checkKeyId]}
            hidden={
              this.drawer &&
              this.drawer.form &&
              this.drawer.form.getFieldValue('loginWay') === 2
            }
          >
            <Input
              placeholder="输入keyId"
              type="password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            prop="secretWord"
            label="输入口令"
            required
            rules={[this.checkFieldRequired(2), textRange(0, 32)]}
            hidden={
              this.drawer &&
              this.drawer.form &&
              this.drawer.form.getFieldValue('loginWay') === 1
            }
          >
            <Input
              placeholder="输入口令"
              type="password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item prop="description" label="描述" rules={[textRange(0, 50)]}>
            <TextArea rows={3} placeholder="描述" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
