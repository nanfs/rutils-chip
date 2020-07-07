import React from 'react'
import { Form, Input } from 'antd'
import { Drawerx, Formx, TreeSelectx, Selectx, Title } from '@/components'

import userApi from '@/services/user'
import {
  required,
  checkName,
  textRange,
  checkPassword,
  checkEmail
} from '@/utils/valid'
import encrypt from '@/utils/encrypt'

export default class AddDrawer extends React.Component {
  checkFieldRequired(fieldValue) {
    return (rule, value, callback) => {
      const domain = this.drawer.form.getFieldValue('domain')
      if (domain === fieldValue && !value) {
        callback(new Error('这是必填项'))
      }
      callback()
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = () => {
    this.drawer.show()
    this.drawer.form.setFieldsValue({ domain: '' })
  }

  addUser = values => {
    const { password, ...rest } = values
    userApi
      .addUser({ password: encrypt(password), ...rest })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
      })
  }

  // 域改变后 需要重新刷新
  selectChange = () => {
    this.forceUpdate()
  }

  render() {
    const { nodeData, domainlist } = this.props

    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
        onOk={values => {
          console.log(values)
          this.addUser(values)
        }}
      >
        <Formx
          onRef={ref => {
            this.form = ref
          }}
        >
          <Title slot="基础设置"></Title>
          <Form.Item prop="domain" label="域" required rules={[required]}>
            <Selectx
              placeholder="请选择域"
              options={domainlist}
              onChange={this.selectChange}
            ></Selectx>
          </Form.Item>
          <Form.Item
            prop="lastname"
            label="姓"
            required
            rules={[required, textRange(0, 29), checkName]}
          >
            <Input placeholder="姓" />
          </Form.Item>
          <Form.Item
            prop="firstname"
            label="名"
            required
            rules={[required, textRange(0, 28), checkName]}
          >
            <Input placeholder="名" />
          </Form.Item>
          <Form.Item
            prop="username"
            label="用户名"
            required
            rules={[required, textRange(0, 20), checkName]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            prop="password"
            label="密码"
            required
            rules={[required, checkPassword]}
          >
            <Input.Password placeholder="密码" autoComplete="new-password" />
          </Form.Item>
          <Form.Item prop="groupId" label="组织" required rules={[required]}>
            <TreeSelectx nodeData={nodeData} placeholder="请选择组织" />
          </Form.Item>
          <Form.Item prop="email" label="邮箱" rules={[checkEmail]}>
            <Input placeholder="邮箱" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
