import React from 'react'
import { Formx, Modalx } from '@/components'
import { Form, Input } from 'antd'
import templateApi from '@/services/template'
import { required, checkName } from '@/utils/valid'

const { TextArea } = Input
const { createModalCfg } = Modalx
export default class AddTemplateModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = vmId => {
    this.modal.show()
    this.modal.form.setFieldsValue({ vmId })
  }

  onOk = values => {
    templateApi
      .addTem(values)
      .then(res => {
        this.modal.afterSubmit(res)
      })
      .catch(error => {
        console.log(error)
        this.modal.break(error)
      })
  }

  render() {
    const modalCfg = createModalCfg({ title: '创建模板' })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        title={'创建模板'}
        onOk={this.onOk}
      >
        <Formx>
          <Form.Item prop="vmId" label="模板id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            prop="templateName"
            label="模板名称"
            rules={[required, checkName]}
          >
            <Input placeholder="模板名称"></Input>
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea style={{ resize: 'none' }} rows={4} placeholder="描述" />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
