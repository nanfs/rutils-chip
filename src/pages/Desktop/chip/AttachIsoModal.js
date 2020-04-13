import React from 'react'
import { Formx, Modalx, Selectx } from '@/components'
import { Form, Input, message } from 'antd'
import desktopsApi from '@/services/desktops'
import { required } from '@/utils/valid'
import { wrapResponse } from '@/utils/tool'

const { TextArea } = Input
const { createModalCfg } = Modalx
export default class AttachIsoModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = vmId => {
    this.modal.show()
    this.getIso()
    this.modal.form.setFieldsValue({ vmId })
  }

  /**
   *
   * 获取ISO列表 判断 加入到对应列表
   */
  getIso = () => {
    const { storagePoolId } = this.state
    if (!storagePoolId) {
      return message.error('请先选择集群')
    }
    return desktopsApi.getIso({ storagePoolId }).then(res =>
      wrapResponse(res)
        .then(() => {
          this.setState({
            isoOptions: res.data.map(item => ({ value: item, label: item }))
          })
        })
        .catch(error => {
          message.error(error.message || error)
        })
    )
  }

  onOk = values => {
    desktopsApi
      .attachIso(values)
      .then(res => {
        this.modal.afterSubmit(res)
      })
      .catch(error => {
        console.log(error)
        this.modal.break(error)
      })
  }

  render() {
    const modalCfg = createModalCfg({ title: '附加CD', hasFooter: true })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
      >
        <Formx>
          <Form.Item prop="vmId" label="虚拟机id" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="templateName" label="CD" rules={[required]}>
            <Selectx getData={this.getIso} options={this.state?.isoOptions} />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
