import React from 'react'
import { Formx, Modalx } from '@/components'
import { Form, Input, Switch, Alert } from 'antd'
import desktopApi from '@/services/desktops'
import { required } from '@/utils/valid'

const { TextArea } = Input
const { createModalCfg } = Modalx
export default class AddSnapModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = (vmId, status) => {
    this.modal.show()
    this.setState({ vmStatus: status })
    this.modal.form.setFieldsValue({ vmId, restoreMemory: 'true' })
  }

  onOk = values => {
    const { restoreMemory, ...data } = values
    const postData = this.state?.vmStatus === 1 ? { ...values } : { ...data }
    desktopApi
      .addSnap(postData)
      .then(res => {
        this.modal.afterSubmit(res)
      })
      .catch(error => {
        this.modal.break(error)
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
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <Form.Item prop="vmId" label="vmId" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="description" label="描述" rules={[required]}>
            <TextArea style={{ resize: 'none' }} rows={4} placeholder="描述" />
          </Form.Item>
          <Form.Item
            prop="restoreMemory"
            label="是否保存内存"
            hidden={this.state?.vmStatus !== 1}
            valuepropname="checked"
          >
            <Switch
              name="usageFix"
              checkedChildren="保存"
              unCheckedChildren="不保存"
            />
          </Form.Item>
          {this.state?.vmStatus === 1 && (
            <Alert
              message="在保存内存时VM会暂停, 如未安装 guesttools 保存数据可能有问题"
              type="warning"
              showIcon
            />
          )}
        </Formx>
      </Modalx>
    )
  }
}
