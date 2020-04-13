import React from 'react'
import { Formx, Modalx, Selectx } from '@/components'
import { Form, Input, message } from 'antd'
import desktopsApi from '@/services/desktops'
import { required } from '@/utils/valid'
import { wrapResponse } from '@/utils/tool'

const { createModalCfg } = Modalx
export default class AttachIsoModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = (vmId, storagePoolId, currentCd) => {
    this.modal.show()
    this.getIso(storagePoolId)
    this.modal.form.setFieldsValue({ vmId, isoName: currentCd })
  }

  /**
   *
   * 获取ISO列表 判断 加入到对应列表
   * 增加一个默认弹出的选项
   */
  getIso = storagePoolId => {
    if (!storagePoolId) {
      return message.error('获取数据中心出错')
    }
    return desktopsApi.getIso({ storagePoolId }).then(res =>
      wrapResponse(res)
        .then(() => {
          const isoOptions = res.data.map(item => ({
            value: item,
            label: item
          }))
          this.setState({
            isoOptions: [{ value: '', label: '弹出' }, ...isoOptions]
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
          <Form.Item prop="isoName" label="CD" rules={[required]}>
            <Selectx getData={this.getIso} options={this.state?.isoOptions} />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
