import React from 'react'
import { Formx, Modalx } from '@/components'
import { Form, Switch, Input } from 'antd'
import vmgroupsApi from '@/services/vmgroups'
import { wrapResponse } from '@/utils/tool'

const { createModalCfg } = Modalx
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  }
}
export default class DeleteModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = ({ ids }) => {
    this.modal.show()
    this.modal.form.setFieldsValue({ ids, isDeleteDesktop: false })
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
        formItemLayout={formItemLayout}
        modalCfg={modalCfg}
        onSuccess={this.props.onSuccess}
        onOk={this.delete}
      >
        <Formx>
          <Form.Item prop="ids" label="桌面组id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="删除组内桌面"
            prop="isDeleteDesktop"
            valuepropname="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
