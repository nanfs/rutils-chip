// TODO 添加加密
import React from 'react'
import { Form, Input, Select } from 'antd'
import { Drawerx, Formx, Title } from '@/components'
import terminalApi from '@/services/terminal'
import {
  required,
  checkName,
  textRange,
  checkKeyId,
  checkPassword
} from '@/utils/valid'
import encrypt from '@/utils/encrypt'

const { Option } = Select
const { TextArea } = Input

export default class EditDrawer extends React.Component {
  /**
   * @param {string} fieldValue
   * @returns
   * @memberof EditDrawer
   * @author linghu
   * @description 如果fieldValue与loginWay的值相等，则为必填
   */
  checkFieldRequired(fieldValue) {
    return (rule, value, callback) => {
      const loginWay = this.drawer.form.getFieldValue('loginWay')
      if (loginWay === fieldValue && !value) {
        callback(new Error('这是必填项'))
      }
      callback()
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  /**
   * @memberof EditDrawer
   * @param data 选中行数据
   * @description 打开终端编辑抽屉，传入选中行数据回显表单
   * @author linghu
   */
  pop = data => {
    this.drawer.show()
    const {
      sn,
      name,
      description,
      loginWay,
      location,
      secretWord,
      bondKey,
      lockedWord
    } = data
    this.drawer.form.setFieldsValue({
      sn,
      name,
      description,
      loginWay,
      location,
      secretWord,
      bondKey,
      lockedWord
    })
  }

  selectChange = () => {
    this.forceUpdate()
  }

  editTerminal = values => {
    const {
      sn,
      name,
      description,
      loginWay,
      location,
      secretWord,
      bondKey,
      lockedWord
    } = values
    const data = {
      name,
      description,
      loginWay,
      location,
      secretWord: loginWay === 2 ? encrypt(secretWord) : '',
      bondKey: loginWay === 1 ? bondKey : '',
      lockedWord: encrypt(lockedWord)
    }
    terminalApi
      .editTerminal(sn, data)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
        console.log(errors)
      })
  }

  render() {
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          this.editTerminal(values)
          return false
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="sn" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            prop="name"
            label="终端名称"
            required
            rules={[required, checkName, textRange(0, 63)]}
          >
            <Input placeholder="终端名称" />
          </Form.Item>
          <Form.Item
            prop="location"
            label="终端位置"
            rules={[textRange(0, 50)]}
          >
            <Input placeholder="终端位置" />
          </Form.Item>
          <Form.Item
            prop="loginWay"
            label="认证方式"
            required
            rules={[required]}
          >
            <Select onChange={this.selectChange}>
              <Option value={1}>KEYID</Option>
              <Option value={2}>安全口令</Option>
            </Select>
          </Form.Item>
          <Form.Item
            prop="bondKey"
            label="输入KEYID"
            rules={[textRange(0, 64), checkKeyId]}
            hidden={
              this.drawer &&
              this.drawer.form &&
              this.drawer.form.getFieldValue('loginWay') === 2
            }
          >
            <Input placeholder="输入KEYID" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            prop="secretWord"
            label="输入口令"
            required
            rules={[this.checkFieldRequired(2), textRange(0, 32)]}
            hidden={
              this.drawer &&
              this.drawer.form &&
              this.drawer.form.getFieldValue('loginWay') === 1
            }
          >
            <Input
              placeholder="输入口令"
              type="password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            prop="lockedWord"
            label="锁定密码"
            required
            rules={[required, checkPassword]}
          >
            <Input
              placeholder="锁定密码"
              type="password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item prop="description" label="描述" rules={[textRange(0, 50)]}>
            <TextArea rows={3} placeholder="描述" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
