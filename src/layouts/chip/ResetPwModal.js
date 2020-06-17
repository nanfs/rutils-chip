import React from 'react'

import appApi from '@/services/app'
import { Formx, Modalx } from '@/components'
import { Form, Input, message } from 'antd'
import encrypt from '@/utils/encrypt'
import { required, checkPassword } from '@/utils/valid'
import { getUser } from '@/utils/checkPermissions'

const { createModalCfg } = Modalx
export default class ModalDemo extends React.Component {
  comparePwd = (rule, value, callback) => {
    const newPassword = this.modal.form.getFieldValue('newPassword')
    if (newPassword) {
      if (newPassword !== value) {
        callback(new Error('两次密码不一致'))
      }
    }
    callback()
  }

  compareSame = (rule, value, callback) => {
    const oldPassword = this.modal.form.getFieldValue('oldPassword')
    if (oldPassword) {
      if (oldPassword === value) {
        callback(new Error('新密码与旧密码一致！'))
      }
    }
    callback()
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = () => {
    this.modal.show()
  }

  onOk = values => {
    const { oldPassword, newPassword } = values
    appApi
      .updatePwd({
        oldPassword: encrypt(oldPassword),
        newPassword: encrypt(newPassword),
        domain: 'internal',
        username: getUser()
      })
      .then(res => {
        this.modal.afterSubmit(res)
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  render() {
    const modalCfg = createModalCfg({ title: '修改密码' })

    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
      >
        <Formx>
          <Form.Item
            prop="oldPassword"
            label="旧密码"
            required
            rules={[required]}
            labelCol={{ sm: { span: 5 } }}
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Input placeholder="输入旧密码" type="password" />
          </Form.Item>
          <Form.Item
            prop="newPassword"
            label="新密码"
            required
            rules={[required, checkPassword, this.compareSame]}
            labelCol={{ sm: { span: 5 } }}
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Input placeholder="输入新密码" type="password" />
          </Form.Item>
          <Form.Item
            prop="confirmPassword"
            label="确认新密码"
            required
            rules={[required, this.comparePwd]}
            labelCol={{ sm: { span: 5 } }}
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Input placeholder="确认新密码" type="password" />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
