import React from 'react'
import { Form, Input, Select } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title from '@/components/Title'

const { Option } = Select

export default class editDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  render() {
    // const { getFieldDecorator } = this.props.form
    const { initValues } = this.props
    // console.log(initValues)
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
        }}
      >
        <Formx
          initValues={initValues}
          onRef={ref => {
            this.form = ref
          }}
        >
          <Title slot="基础设置"></Title>
          <Form.Item
            prop="domain"
            label="域"
            rules={[
              {
                required: true,
                message: '请选择域'
              }
            ]}
          >
            <Select placeholder="用户名">
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
              <Option value="3">Option 3</Option>
            </Select>
          </Form.Item>
          <Form.Item
            prop="name"
            label="姓名"
            rules={[
              {
                required: true,
                message: '请填写姓名'
              }
            ]}
          >
            <Input placeholder="姓名" />
          </Form.Item>
          <Form.Item
            prop="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请选择用户名'
              }
            ]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            prop="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请填写密码'
              }
            ]}
          >
            <Input placeholder="密码" type="password" />
          </Form.Item>
          <Form.Item
            prop="group"
            label="组织"
            rules={[
              {
                required: true,
                message: '请选择组织'
              }
            ]}
          >
            <Select placeholder="组织">
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
              <Option value="3">Option 3</Option>
            </Select>
          </Form.Item>
          <Form.Item
            prop="email"
            label="邮件"
            rules={[
              {
                required: true,
                message: '请输入邮件'
              }
            ]}
          >
            <Input placeholder="邮件" />
          </Form.Item>
          <Form.Item
            prop="KEYID"
            label="KEYID"
            rules={[
              {
                required: true,
                message: '请输入KEYID'
              }
            ]}
          >
            <Input placeholder="KEYID" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}