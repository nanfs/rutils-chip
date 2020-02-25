import React from 'react'
import { Form, Input, Slider, InputNumber, Row, Col, Select } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title from '@/components/Title'
// import SliderNumber from '@/components/SliderNumber'

import terminalApi from '@/services/terminal'

const { Option } = Select
const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.initValues.autoLockTime !== this.props.initValues.autoLockTime
    ) {
      this.setState({
        autoLockTime: this.props.initValues.autoLockTime
      })
    }
  }

  pop = data => {
    this.drawer.show()
    const {
      id,
      name,
      description,
      loginWay,
      location,
      secretWord,
      bondKey
    } = data
    this.drawer.form.setFieldsValue({
      id,
      name,
      description,
      loginWay,
      location,
      secretWord,
      bondKey
    })
  }

  state = {
    autoLockTime: 1
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
      id,
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
      .editTerminal(id, data)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  render() {
    const { initValues } = this.props
    // console.log(initValues)
    const { autoLockTime } = this.state
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          // values.autoLockTime = autoLockTime
          // console.log(values)
          this.editTerminal(values)
          return false
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx initValues={initValues}>
          <Title slot="基础设置"></Title>
          <Form.Item prop="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            prop="name"
            label="终端名称"
            rules={[
              {
                required: true,
                message: '请输入终端名称'
              }
            ]}
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
            rules={[
              {
                required: true,
                message: '请输入信息位置'
              }
            ]}
          >
            <Input placeholder="信息位置" />
          </Form.Item>
          <Form.Item
            prop="loginWay"
            label="认证方式"
            rules={[
              {
                required: true,
                message: '请选择认证方式'
              }
            ]}
          >
            <Select onChange={this.selectChange}>
              <Option value={1}>keyId</Option>
              <Option value={2}>安全口令</Option>
            </Select>
          </Form.Item>
          <Form.Item
            prop="bondKey"
            label="输入keyId"
            rules={[
              {
                required: true,
                message: '请输入keyId'
              }
            ]}
            hidden={
              this.drawer &&
              this.drawer.form &&
              this.drawer.form.getFieldValue('loginWay') === 2
            }
          >
            <Input placeholder="输入keyId" type="password" />
          </Form.Item>
          <Form.Item
            prop="secretWord"
            label="输入口令"
            rules={[
              {
                required: true,
                message: '请输入口令'
              }
            ]}
            hidden={
              this.drawer &&
              this.drawer.form &&
              this.drawer.form.getFieldValue('loginWay') === 1
            }
          >
            <Input placeholder="输入口令" type="password" />
          </Form.Item>
          <Form.Item prop="description" label="描述" rules={[]}>
            <TextArea rows={3} placeholder="描述" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
