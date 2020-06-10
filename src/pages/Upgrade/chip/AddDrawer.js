import React from 'react'
import { Form, Input, Upload, Button } from 'antd'
import { Drawerx, Formx, Radiox, Title, Uploadx } from '@/components'

import userApi from '@/services/user'
import { required, checkName } from '@/utils/valid'

const { TextArea } = Input

export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = () => {
    this.drawer.show()
  }

  addUpgrade = values => {
    const { password, ...rest } = values
    userApi
      .addUpgrade({ ...rest })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
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
        onOk={values => {
          console.log(values)
          this.addUpgrade(values)
        }}
      >
        <Formx
          onRef={ref => {
            this.form = ref
          }}
        >
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="升级包名称" required rules={[required]}>
            <Input placeholder="升级包名称" />
          </Form.Item>
          <Form.Item
            prop="package"
            label="上传升级包"
            required
            rules={[required]}
          >
            <Uploadx
              hasInput
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            />
          </Form.Item>
          <Form.Item prop="priority" required label="优先级">
            <Radiox
              options={[
                { label: '强制', value: '1' },
                { label: '非强制', value: '2' }
              ]}
            />
          </Form.Item>
          <Form.Item prop="terminalType" required label="终端型号">
            <Radiox
              options={[
                { label: '强制', value: '1' },
                { label: '非强制', value: '2' }
              ]}
            />
          </Form.Item>
          <Form.Item prop="type" required label="升级包类型">
            <Radiox
              options={[
                { label: '全量', value: '1' },
                { label: '增量', value: '2' }
              ]}
            />
          </Form.Item>
          <Form.Item
            prop="vision"
            label="升级包版本"
            required
            rules={[required]}
          >
            <Input placeholder="升级包版本" />
          </Form.Item>
          <Form.Item prop="log" label="升级日志">
            <TextArea rows={4} placeholder="升级日志" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
