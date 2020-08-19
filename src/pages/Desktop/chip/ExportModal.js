import React from 'react'
import { Formx, Modalx } from '@/components'
import { Form, Checkbox, Input } from 'antd'
import templateApi from '@/services/template'

const { createModalCfg } = Modalx
export default class ExportModal extends React.Component {
  state = {
    vmName: '',
    description: false
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = (vmId, vmName, temp) => {
    this.modal.show()
    this.setState({ vmName, temp })
    this.modal.form.setFieldsValue({ vmId })
  }

  onOk = values => {
    console.log(values)
    // templateApi
    //   .addTem(values)
    //   .then(res => {
    //     this.modal.afterSubmit(res)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     this.modal.break(error)
    //   })
  }

  render() {
    const modalCfg = createModalCfg({ title: '导出虚拟机' })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        title={'导出虚拟机'}
        onOk={this.onOk}
      >
        <Formx>
          <Form.Item prop="vmId" label="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="a">
            <Checkbox>强制覆盖</Checkbox>
          </Form.Item>
          <Form.Item prop="b" hidden={this.state.temp}>
            <Checkbox>Collapse 快照</Checkbox>
          </Form.Item>
          <p hidden={this.state?.description} style={{ color: '#CD2127' }}>
            虚拟机: {this.state.vmName}{' '}
            已经存在于目标导出域中。如果您想覆盖它们，请选择
            &apos;ForceOverride&apos; 复选框。
          </p>
        </Formx>
      </Modalx>
    )
  }
}
