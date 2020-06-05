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

export default class editDrawer extends React.Component {
  checkFieldRequired(fieldValue) {
    return (rule, value, callback) => {
      const domain = this.drawer.form.getFieldValue('domain')
      if (domain === fieldValue && value !== 0 && !value) {
        callback(new Error('这是必填项'))
      }
      callback()
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = (data, groupType) => {
    this.drawer.show()
    const {
      id,
      firstname,
      lastname,
      username,
      password,
      groupId,
      email
      // isAdDomain = false
    } = data
    const domain = groupType
    this.drawer.form.setFieldsValue({
      id,
      domain,
      firstname,
      lastname,
      username,
      password,
      groupId,
      email
    })
  }

  editUser = values => {
    const { password, ...rest } = values
    userApi
      .editUser({ password: encrypt(password), ...rest })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
      })
  }

  render() {
    const { nodeData, domainlist } = this.props

    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          this.editUser(values)
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx
          onRef={ref => {
            this.form = ref
          }}
        >
          <Title slot="基础设置"></Title>
          <Form.Item prop="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="domain" label="域" required rules={[required]}>
            <Selectx
              placeholder="请选择域"
              options={domainlist}
              disabled={true}
            ></Selectx>
          </Form.Item>
          <Form.Item
            prop="lastname"
            label="姓"
            required
            rules={[required, checkName, textRange(0, 29)]}
          >
            <Input placeholder="姓" />
          </Form.Item>
          <Form.Item
            prop="firstname"
            label="名"
            required
            rules={[required, checkName, textRange(0, 28)]}
          >
            <Input placeholder="名" />
          </Form.Item>
          <Form.Item
            prop="username"
            label="用户名"
            required
            rules={[required, textRange(0, 20)]}
          >
            <Input placeholder="用户名" disabled />
          </Form.Item>
          <Form.Item
            prop="password"
            label="密码"
            required
            rules={[this.checkFieldRequired('internal'), checkPassword]}
            hidden={
              this.drawer &&
              this.drawer.form &&
              this.drawer.form.getFieldValue('domain') !== 'internal'
            }
          >
            <Input
              placeholder="密码"
              type="password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            prop="groupId"
            label="组织"
            required
            rules={[required /* this.checkFieldRequired('internal') */]}
            /* hidden={
              this.drawer &&
              this.drawer.form &&
              this.drawer.form.getFieldValue('domain') !== 'internal'
            } */
          >
            <TreeSelectx nodeData={nodeData} placeholder="请选择" />
          </Form.Item>
          <Form.Item prop="email" label="邮箱" rules={[checkEmail]}>
            <Input placeholder="邮箱" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
