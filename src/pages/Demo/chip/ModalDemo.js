import React from 'react'

import taskApi from '@/services/task'
import Modalx, { createModalCfg } from '@/components/Modalx'
import Formx from '@/components/Formx'
import { Form, Input, Icon } from 'antd'
import { minLength } from '@/utils/valid'

export default class ModalDemo extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  getResult = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        taskApi.list().then(res => {
          console.log(res)
          resolve(res)
        })
      }, 1000)
    })
  }

  pop = () => {
    this.modal.show()
  }

  onOk = () => {
    this.getResult().then(res => this.modal.afterSubmit(res))
  }

  render() {
    const modalCfg = createModalCfg({ title: '弹窗' })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
      >
        <Formx>
          <Form.Item prop="username" label="用户名称" rules={[minLength(2)]}>
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="username"
            />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
