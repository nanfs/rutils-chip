import React from 'react'

import Formx from '../../Formx'
import Modalx, { createModalCfg } from '../../Modalx'
import { Form, Input, message } from 'antd'

import { required, checkName, textRange } from '@/utils/valid'

export default class EditNodeModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = () => {
    this.modal.show()
  }

  onOk = values => {
    const { editNodeApiMethod, nodeValues, editNodeSuccess } = this.props
    const parentId =
      nodeValues.parentId === '-1' ? null : parseInt(nodeValues.parentId, 10)
    editNodeApiMethod({
      ...values,
      id: parseInt(nodeValues.id, 10),
      parentId
    })
      .then(res => {
        if (res.success) {
          editNodeSuccess && editNodeSuccess()
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
    const modalCfg = createModalCfg({ title: '修改' })
    const { editNodeApiMethod, nodeValues } = this.props
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
      >
        <Formx initValues={nodeValues}>
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
