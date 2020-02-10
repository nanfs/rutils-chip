import React from 'react'
import { Form, Input, Button } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title from '@/components/Title'
import templateApi from '@/services/template'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  cancelEdit = () => {
    this.formx.props.form.resetFields()
  }

  render() {
    const { initValues } = this.props
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          templateApi.updateTem(values)
          return false
        }}
      >
        <Formx
          initValues={initValues}
          onRef={ref => {
            this.formx = ref
          }}
        >
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="模板名称" required>
            <Input name="name" placeholder="模板名称" />
          </Form.Item>
          <Form.Item prop="parentName" label="父模板" required>
            <Input name="parentName" placeholder="父模板" />
          </Form.Item>
          <Form.Item prop="clusterName" label="集群" required>
            <Input name="clusterName" placeholder="集群" />
          </Form.Item>
          <Form.Item prop="datacenterName" label="数据中心" required>
            <Input name="datacenterName" placeholder="数据中心" />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea
              style={{ resize: 'none' }}
              rows={4}
              name="description"
              placeholder="描述"
            />
          </Form.Item>
          {/* <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 10, offset: 3 }
            }}
          >
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button onClick={this.cancelEdit}>取消</Button>
          </Form.Item> */}
        </Formx>
      </Drawerx>
    )
  }
}
