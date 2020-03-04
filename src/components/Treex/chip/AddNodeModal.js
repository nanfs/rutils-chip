import React from 'react'

import Modalx, { createModalCfg } from '../../Modalx'
import Formx from '../../Formx'
import { Form, Input, message } from 'antd'

import { required, checkName, textRange } from '@/utils/valid'

export default class AddNodeModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = () => {
    this.modal.show()
  }

  onOk = values => {
    const { addNodeApiMethod, nodeValues, addNodeSuccess } = this.props
    addNodeApiMethod({
      ...values,
      parentId: nodeValues.id === '-1' ? null : parseInt(nodeValues.id, 10)
    })
      .then(res => {
        if (res.success) {
          addNodeSuccess && addNodeSuccess()
        } else {
          // this.nodes = []
        }
        this.modal.afterSubmit(res)
      })
      .catch(e => {
        message.error(e)
      })
  }

  render() {
    const modalCfg = createModalCfg({ title: '新增' })
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
            prop="name"
            label="名称"
            required
            rules={[required, checkName, textRange(0, 10)]}
            labelCol={{ sm: { span: 5 } }}
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Input placeholder="输入名称" />
          </Form.Item>
          {/* <Form.Item
            prop="parentNode"
            label="父节点"
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
          </Form.Item> */}
        </Formx>
      </Modalx>
    )
  }
}
