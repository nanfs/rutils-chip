import React from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'antd'
import { Field, ReduxForm, PasswordField } from '@/components/ReduxForm'
import { required } from '@/utils/valid'

function SetPwdForm(props) {
  const { onCancel, onSubmit } = props
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  }
  return (
    <Form {...formItemLayout} className="password-form" onSubmit={onSubmit}>
      <Form.Item label="原密码">
        <Field
          name="oldPassword"
          validate={[required]}
          component={PasswordField}
        />
      </Form.Item>
      <Form.Item label="新密码">
        <Field
          name="password"
          validate={[required]}
          component={PasswordField}
        />
      </Form.Item>
      <Form.Item label="确认新密码">
        <Field
          name="confirmPassword"
          validate={[required]}
          component={PasswordField}
        />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 }
        }}
      >
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  )
}
export default ReduxForm({
  form: 'SetPwdForm'
})(SetPwdForm)
