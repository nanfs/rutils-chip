import React from 'react'
import { Formx, Modalx } from '@/components'
import { Form, Input } from 'antd'
import vmgroupsApi from '@/services/template'
import { required, checkName } from '@/utils/valid'
import { wrapResponse } from '@/utils/tool'

const { TextArea } = Input
const { createModalCfg } = Modalx
export default class AddGroupModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = () => {
    this.modal.show()
  }

  add = values => {
    vmgroupsApi
      .add(values)
      .then(res => {
        wrapResponse(res).then(() => {
          this.modal.afterSubmit(res)
        })
      })
      .catch(error => {
        this.modal.break(error)
        console.log(error)
      })
  }

  render() {
    const modalCfg = createModalCfg({ title: '创建桌面组', hasFooter: true })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.add}
      >
        <Formx>
          <Form.Item prop="name" label="名称" rules={[required, checkName]}>
            <Input placeholder="桌面组名称"></Input>
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea style={{ resize: 'none' }} rows={4} placeholder="描述" />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
