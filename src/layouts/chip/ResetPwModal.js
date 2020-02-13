import React from 'react'

import appApi from '@/services/app'
import Modalx, { createModalCfg } from '@/components/Modalx'
import Formx from '@/components/Formx'
import { Form, Input, message } from 'antd'

export default class ModalDemo extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  getResult = values => {
    return new Promise(resolve => {
      setTimeout(() => {
        appApi.updatePwd(values).then(res => {
          console.log(res)
          resolve(res)
        })
      }, 1000)
    })
  }

  pop = () => {
    this.modal.show()
  }

  onOk = values => {
    if (values.confirmPassword !== values.password) {
      // message.error('确认密码与新密码不一致！')
      this.modal.afterSubmit({ message: '新密码与旧密码一致！' })
    } else if (values.oldPassword === values.password) {
      // message.error('新密码与旧密码一致！')
      this.modal.afterSubmit({ message: '新密码与旧密码一致！' })
    } else {
      this.getResult().then(res => this.modal.afterSubmit(res))
    }
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
            rules={[
              {
                required: true,
                message: '请输入旧密码'
              }
            ]}
            labelCol={{ sm: { span: 5 } }}
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Input placeholder="输入旧密码" type="password" />
          </Form.Item>
          <Form.Item
            prop="password"
            label="新密码"
            rules={[
              {
                required: true,
                message: '请输入新密码'
              }
            ]}
            labelCol={{ sm: { span: 5 } }}
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Input placeholder="输入新密码" type="password" />
          </Form.Item>
          <Form.Item
            prop="confirmPassword"
            label="确认新密码"
            rules={[
              {
                required: true,
                message: '请确认新密码'
              }
            ]}
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
