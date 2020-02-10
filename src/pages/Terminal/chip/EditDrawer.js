import React from 'react'
import { Form, Input, Select } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title from '@/components/Title'
import SliderNumber from '@/components/SliderNumber'
import terminalApi from '@/services/terminal'

const { Option } = Select
const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  cancelEdit = () => {
    this.formx.props.form.resetFields()
  }

  state = {
    inputValue: 1
  }

  state = {
    inputValue: 1
  }

  onChange = value => {
    this.setState({
      inputValue: value
    })
  }

  render() {
    const { initValues } = this.props
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
          return false
        }}
      >
        <Formx
          initValues={initValues}
          onRef={ref => {
            this.formx = ref
          }}
        >
          <Title slot="基础设置"></Title>
          <Form.Item
            prop="name"
            label="终端名称"
            rules={[
              {
                required: true,
                message: '请填写终端名称'
              }
            ]}
          >
            <Input placeholder="终端名称" />
          </Form.Item>
          <Form.Item
            prop="autoLockTime"
            label="自动锁屏时间"
            rules={[
              {
                required: true
              }
            ]}
          >
            <SliderNumber inputValue={'1'} />
          </Form.Item>
          <Form.Item
            prop="location"
            label="信息位置"
            rules={[
              {
                required: true,
                message: '请填写信息位置'
              }
            ]}
          >
            <Input placeholder="信息位置" />
          </Form.Item>
          <Form.Item
            prop="securityClassification"
            label="认证方式"
            rules={[
              {
                required: true,
                message: '请选择认证方式'
              }
            ]}
          >
            <Select>
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
              <Option value="0">Option 0</Option>
            </Select>
          </Form.Item>
          <Form.Item
            prop="secretWord"
            label="输入口令"
            rules={[
              {
                required: true,
                message: '请填写输入口令'
              }
            ]}
          >
            <Input placeholder="输入口令" type="password" disabled />
          </Form.Item>
          <Form.Item prop="description" label="描述" rules={[]}>
            <TextArea rows={3} placeholder="描述" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
