import React from 'react'
import systemsApi from '@/services/systems'
import { Formx, Modalx } from '@/components'
import { Form, InputNumber, Input } from 'antd'
import './index.less'
import {
  required,
  lessThanValue,
  moreThanValue,
  isInt,
  checkPassword
} from '@/utils/valid'
import encrypt from '@/utils/encrypt'

const { createModalCfg } = Modalx
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8, pull: 1 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
}

export default class ConfigModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = () => {
    this.modal.show()
    systemsApi
      .datail()
      .then(res => {
        this.modal.form.setFieldsValue(res.data)
      })
      .catch(errors => {
        this.modal.break(errors)
      })
  }

  onOk = values => {
    const { tcAdministratorWord, ...rest } = values
    systemsApi
      .edit({ tcAdministratorWord: encrypt(tcAdministratorWord), ...rest })
      .then(res => {
        this.modal.afterSubmit(res)
      })
      .catch(errors => {
        this.modal.break(errors)
      })
  }

  render() {
    const modalCfg = createModalCfg({ title: '系统设置', width: '600px' })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
        className="sys-modal"
        formItemLayout={formItemLayout}
      >
        <Formx>
          {/* <Form.Item
            prop="sessionTimeOutInterval"
            label="会话超时时间"
            rules={[sessionTime]}
          >
            <InputNumber min={-1} style={{ width: '100%' }} />
          </Form.Item> */}
          <Form.Item
            prop="userLoginFailMaxTimes"
            label="登录失败最大次数(次)"
            rules={[required, lessThanValue(10), moreThanValue(1), isInt]}
          >
            <InputNumber min={1} style={{ width: '100%' }} max={10} />
          </Form.Item>
          <Form.Item
            prop="userLoginFailLockTimeThreshold"
            label="登录失败锁定时间(分钟)"
            rules={[required, lessThanValue(60), moreThanValue(1), isInt]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              max={60}
              formatter={value => `${value}`}
              parser={value => value}
            />
          </Form.Item>
          <Form.Item
            prop="tcTaskCleanDays"
            label="任务清理时间(天)"
            rules={[required, lessThanValue(30), moreThanValue(1), isInt]}
          >
            <InputNumber min={1} style={{ width: '100%' }} max={30} />
          </Form.Item>
          <Form.Item
            prop="tcAdministratorWord"
            label="终端管理员密码"
            rules={[required, checkPassword]}
          >
            <Input placeholder="终端管理员密码" type="password" />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
