import React from 'react'

import appApi from '@/services/app'
import Modalx, { createModalCfg } from '@/components/Modalx'
import Formx from '@/components/Formx'
import { Form, Input, message } from 'antd'

export default class AddNodeModal extends React.Component {
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
    const { addNodeApiMethod, nodeValues, addNodeSuccess } = this.props
    addNodeApiMethod({ ...values, parentId: nodeValues.props['data-key'] })
      .then(res => {
        if (res.success) {
          addNodeSuccess && addNodeSuccess()
        } else {
          // this.nodes = []
        }
      })
      .catch(e => {
        console.log(e)
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
            rules={[
              {
                required: true,
                message: '请输入名称'
              }
            ]}
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
