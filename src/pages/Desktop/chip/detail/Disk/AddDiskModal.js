import React from 'react'
import { Formx, Modalx } from '@/components'
import { Form, Input, InputNumber } from 'antd'
import diskApi from '@/services/disks'
import { required, isInt } from '@/utils/valid'

const { TextArea } = Input
const { createModalCfg } = Modalx
export default class AddDiskModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = vmId => {
    this.modal.show()
    // 设置默认磁盘大小为 50G
    this.modal.form.setFieldsValue({ vmId, capacity: 50 })
  }

  onOk = values => {
    diskApi
      .add(values)
      .then(res => {
        this.modal.afterSubmit(res)
      })
      .catch(error => {
        this.modal.break(error)
        console.log(error)
      })
  }

  render() {
    const modalCfg = createModalCfg({ title: '添加磁盘' })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <Form.Item prop="vmId" label="vmId" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="name" label="磁盘名" rules={[required]} required>
            <Input />
          </Form.Item>
          <Form.Item
            prop="capacity"
            label="磁盘大小(G)"
            rules={[required, isInt]}
            required
          >
            <InputNumber
              min={1}
              width={300}
              max={2000}
              step={10}
              formatter={value => `${value}`}
              parser={value => value}
            ></InputNumber>
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea style={{ resize: 'none' }} rows={4} placeholder="描述" />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
