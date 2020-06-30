import React from 'react'
import { Formx, Modalx } from '@/components'
import { Form, Switch, Input } from 'antd'
import vmgroupsApi from '@/services/vmgroups'
import { wrapResponse } from '@/utils/tool'

const { createModalCfg } = Modalx
export default class DeleteModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = ({ ids }) => {
    this.modal.show()
    this.modal.form.setFieldsValue({ ids, isDeleteDesktop: true })
  }

  delete = values => {
    vmgroupsApi.delete(values).then(res => {
      wrapResponse(res)
        .then(() => {
          this.modal.afterSubmit(res)
        })
        .catch(error => {
          this.modal.break(error)
          console.log(error)
        })
    })
  }

  render() {
    const modalCfg = createModalCfg({
      title: '删除桌面组',
      width: '400px'
    })

    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onSuccess={this.props.onSuccess}
        onOk={this.delete}
      >
        <Formx>
          <Form.Item prop="ids" label="桌面组id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="是否删除桌面"
            prop="isDeleteDesktop"
            valuepropname="checked"
          >
            <Switch checkedChildren="删除" unCheckedChildren="保留" />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
