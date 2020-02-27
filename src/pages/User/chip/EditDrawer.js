import React from 'react'
import { Form, Input, Select } from 'antd'

import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import TreeSelectx from '@/components/TreeSelectx'
import Selectx from '@/components/Selectx'
import Title from '@/components/Title'

import userApi from '@/services/user'

const { Option } = Select

export default class editDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = data => {
    this.drawer.show()
    const {
      id,
      domain,
      firstname,
      lastname,
      username,
      password,
      groupId,
      email
    } = data
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
    const { onSuccess } = this.props
    userApi
      .editUser({ ...values })
      .then(res => {
        this.drawer.afterSubmit(res)
        onSuccess && onSuccess()
      })
      .catch(errors => {
        this.drawer.break()
        console.log(errors)
      })
  }

  render() {
    // const { getFieldDecorator } = this.props.form
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
            <Selectx
              placeholder="请选择域"
              options={domainlist}
              disabled={true}
            ></Selectx>
          </Form.Item>
          <Form.Item
            prop="firstname"
            label="姓"
            rules={[
              {
                required: true,
                message: '请填写姓'
              }
            ]}
          >
            <Input placeholder="名" />
          </Form.Item>
          <Form.Item
            prop="lastname"
            label="名"
            rules={[
              {
                required: true,
                message: '请填写名'
              }
            ]}
          >
            <Input placeholder="名" />
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
            <Input placeholder="密码" type="password" disabled />
          </Form.Item>
          <Form.Item
            prop="groupId"
            label="组织"
            rules={[
              {
                required: true,
                message: '请选择组织'
              }
            ]}
          >
            <TreeSelectx nodeData={nodeData} />
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
          {/* <Form.Item
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
          </Form.Item> */}
        </Formx>
      </Drawerx>
    )
  }
}
