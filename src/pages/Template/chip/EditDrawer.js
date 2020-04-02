import React from 'react'
import { Form, Input } from 'antd'
import { Drawerx, Formx, Title } from '@/components'
import templateApi from '@/services/template'
import { required, checkName } from '@/utils/valid'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  /**
   * @param data 编辑模板的初始值
   */
  pop = data => {
    this.drawer.show()
    const {
      id,
      name,
      parentName,
      clusterName,
      datacenterName,
      description
    } = data
    this.drawer.form.setFieldsValue({
      id,
      name,
      parentName,
      clusterName,
      datacenterName,
      description
    })
  }

  /**
   * @param values 传入的表单值
   * 编辑 模板提交
   */

  editTem = values => {
    templateApi
      .updateTem(values)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
        console.log(errors)
      })
  }

  render() {
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
        onOk={this.editTem}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            prop="name"
            label="模板名称"
            required
            rules={[required, checkName]}
          >
            <Input placeholder="模板名称" />
          </Form.Item>
          <Form.Item prop="parentName" label="父模板">
            <Input placeholder="父模板" disabled />
          </Form.Item>
          <Form.Item prop="clusterName" label="集群">
            <Input placeholder="集群" disabled />
          </Form.Item>
          <Form.Item prop="datacenterName" label="数据中心">
            <Input placeholder="数据中心" disabled />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea style={{ resize: 'none' }} rows={4} placeholder="描述" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
