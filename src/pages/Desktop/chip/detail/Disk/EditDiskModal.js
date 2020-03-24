import React from 'react'
import { Formx, Modalx } from '@/components'
import { Form, Input } from 'antd'
import diskApi from '@/services/disks'
import { required } from '@/utils/valid'

const { TextArea } = Input
const { createModalCfg } = Modalx
export default class EditDiskModal extends React.Component {
  moreThanBefore = (rule, value, callback) => {
    const beforeSize = this.state.capacity
    if (value < beforeSize) {
      callback(new Error('应该不小于之前磁盘大小'))
    }
    callback()
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = initValues => {
    this.modal.show()
    this.setState({ capacity: initValues.capacity })
    this.modal.form.setFieldsValue(initValues)
  }

  onOk = values => {
    diskApi
      .edit(values)
      .then(res => {
        this.modal.afterSubmit(res)
      })
      .catch(error => {
        this.modal.break(error)
        console.log(error)
      })
  }

  render() {
    const modalCfg = createModalCfg({ title: '磁盘扩容', hasFooter: true })
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
          <Form.Item prop="id" label="diskId" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="name" label="磁盘名" rules={[required]}>
            <Input />
          </Form.Item>
          <Form.Item
            prop="capacity"
            label="磁盘大小"
            rules={[this.moreThanBefore]}
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
