import React from 'react'
import { Formx, Modalx } from '@/components'
import { Form, Input, message } from 'antd'
import desktopApi from '@/services/desktops'
import { required } from '@/utils/valid'

const { TextArea } = Input
const { createModalCfg } = Modalx
export default class AddSnapModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = vmId => {
    this.modal.show()
    this.modal.form.setFieldsValue({ vmId })
  }

  onOk = values => {
    desktopApi
      .addSnap(values)
      .then(res => {
        this.modal.afterSubmit(res)
      })
      .catch(errors => {
        this.modal.break(errors)
        console.log(errors)
      })
  }

  render() {
    const modalCfg = createModalCfg({ title: '创建快照', hasFooter: true })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
      >
        <Formx>
          <Form.Item prop="vmId" label="vmId" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="name" label="快照名" rules={[required]}>
            <Input />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea style={{ resize: 'none' }} rows={4} placeholder="描述" />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}