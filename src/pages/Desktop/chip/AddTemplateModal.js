import React from 'react'
import Modalx, { createModalCfg } from '@/components/Modalx'
import Formx from '@/components/Formx'
import { Form, Input } from 'antd'

const { TextArea } = Input

export default class AddTemplateModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = id => {
    this.modal.show()
    this.modal.form.setFieldsValue({ id })
  }

  onOk = values => {
    console.log(values)
  }

  render() {
    console.log(this.modal)
    const modalCfg = createModalCfg({ title: '添加模板', hasFooter: true })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        title={'添加模板'}
        onOk={this.onOk}
      >
        <Formx>
          <Form.Item prop="id" label="模板名称" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="templatename" label="模板名称">
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
