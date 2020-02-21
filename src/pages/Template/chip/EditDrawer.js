import React from 'react'
import { Form, Input } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title from '@/components/Title'
import templateApi from '@/services/template'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

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

  editTem = values => {
    templateApi
      .updateTem(values)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break()
        console.log(errors)
      })
  }

  render() {
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onSuccess={this.props.onSuccess}
        onOk={this.editTem}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="name" label="模板名称" required>
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
