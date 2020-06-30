import React from 'react'
import { Formx, Modalx, SliderNumberx } from '@/components'
import { Form, Input } from 'antd'
import diskApi from '@/services/disks'
import { required, isInt } from '@/utils/valid'

const { TextArea } = Input
const { createModalCfg } = Modalx
export default class EditDiskModal extends React.Component {
  // 单磁盘不能大于2T
  totalLessThan2000 = (rule, value, callback) => {
    const beforeSize = this.state.capacity
    if (value + beforeSize > 2000) {
      callback(new Error('磁盘最大不超过2000G'))
    }
    callback()
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = initValues => {
    this.modal.show()
    this.setState({ capacity: initValues.capacity })
    this.modal.form.setFieldsValue({ ...initValues, newCapacity: 0 })
  }

  onOk = values => {
    diskApi
      .edit({ ...values, capacity: values.newCapacity })
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
        onSuccess={this.props.onSuccess}
        onOk={this.onOk}
      >
        <Formx>
          <Form.Item prop="vmId" label="vmId" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="id" label="diskId" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="name" label="磁盘名" rules={[required]} required>
            <Input />
          </Form.Item>
          <Form.Item
            prop="capacity"
            label="当前大小(G)"
            rules={[required]}
            required
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            prop="newCapacity"
            label="扩容大小(G)"
            rules={[this.totalLessThan2000, isInt]}
          >
            <SliderNumberx
              min={0}
              max={this.state?.capacity ? 2000 - this.state?.capacity : 2000}
              hasInputNumber={true}
              step={50}
              formatter={value => `${value}`}
              parser={value => value}
            />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea style={{ resize: 'none' }} rows={4} placeholder="描述" />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
