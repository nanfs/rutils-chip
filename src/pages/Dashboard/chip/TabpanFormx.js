import React from 'react'
import { Form, Input, Button, Select } from 'antd'
import Formx from '@/components/Formx'
import { minLength } from '@/utils/valid'

export default class TabpanFormx extends React.Component {
  matchingPassword = (rule, value, callback) => {
    const username = this.form.props.form.getFieldValue('username')
    if (username) {
      if (username !== value) {
        callback(new Error('二次输入密码不匹配'))
      }
    }
    callback()
  }

  render() {
    const children = []
    for (let i = 10; i < 36; i++) {
      children.push(
        <Select.Option key={i.toString(36) + i}>
          {i.toString(36) + i}
        </Select.Option>
      )
    }
    return (
      <Formx
        onRef={ref => {
          this.formx = ref
        }}
        onSubmit={values => {
          console.log(values)
          return false
        }}
        initValues={{
          username: 'test'
        }}
      >
        <Form.Item prop="username" rules={[minLength(2)]}>
          <Input
            onChange={(value, values) => {
              console.log('value', value, 'values', values)
            }}
          />
        </Form.Item>
        <Form.Item prop="zome">
          <Select
            onChange={() => {
              console.log(this)
              this.formx.props.form.setFieldsValue({ username: 'ls' })
            }}
          >
            {children}
          </Select>
        </Form.Item>
        <Form.Item prop="reusername">
          <Input onChange={this.checkSame} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            提交
          </Button>
        </Form.Item>
      </Formx>
    )
  }
}
