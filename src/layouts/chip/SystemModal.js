import React from 'react'
import systemsApi from '@/services/systems'
import { Formx, Modalx } from '@/components'
import { Form, InputNumber } from 'antd'
import './index.scss'
import { lessThanValue, moreThanValue } from '@/utils/valid'

const { createModalCfg } = Modalx
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7, pull: 1 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
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
    systemsApi
      .edit(values)
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
      >
        <Formx formItemLayout={formItemLayout}>
          {/* <Form.Item
            prop="sessionTimeOutInterval"
            label="会话超时时间"
            rules={[sessionTime]}
          >
            <InputNumber min={-1} style={{ width: '100%' }} />
          </Form.Item> */}
          <Form.Item
            prop="userLoginFailMaxTimes"
            label="登录失败最大次数"
            rules={[lessThanValue(10), moreThanValue(1)]}
          >
            <InputNumber min={1} style={{ width: '100%' }} max={10} />
          </Form.Item>
          <Form.Item
            prop="userLoginFailLockTimeThreshold"
            label="登录失败锁定时间"
            rules={[lessThanValue(60), moreThanValue(1)]}
          >
            <InputNumber min={1} style={{ width: '100%' }} max={60} />
          </Form.Item>

          {/* <Form.Item prop="tcSwitcherPassword" label="交换机共享密钥">
            <Input placeholder="交换机共享密钥" type="password" />
          </Form.Item> */}
        </Formx>
      </Modalx>
    )
  }
}
