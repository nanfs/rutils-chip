import React from 'react'
import { Form, Input, Upload, Button } from 'antd'
import { Drawerx, Formx, Radiox, Title, Uploadx } from '@/components'
import { required, checkName } from '@/utils/valid'

import upgrade from '@/services/upgrade'

const { TextArea } = Input

export default class AddDrawer extends React.Component {
  state = {
    fileList: []
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = () => {
    this.drawer.show()
  }

  addUpgrade = values => {
    console.log(this.state.file)
    upgrade
      .addUpgrade({ ...values, file: this.state.file })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
      })
  }

  fileChange = fileList => {
    this.setState({ file: fileList[0] })
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
          encType="multipart/form-data"
        >
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="升级包名称" required rules={[required]}>
            <Input placeholder="升级包名称" />
          </Form.Item>
          <Form.Item
            prop="package"
            label="上传升级包"
            required
            // rules={[required]}
          >
            <Uploadx
              hasInput
              action=""
              inputValue=""
              fileChange={this.fileChange}
            />
          </Form.Item>
          <Form.Item prop="priorityLevel" required label="优先级">
            <Radiox
              options={[
                { label: '强制', value: '1' },
                { label: '非强制', value: '0' }
              ]}
            />
          </Form.Item>
          <Form.Item prop="model" required label="终端型号">
            {/* <Radiox
              options={[
                { label: '非强制', value: '0' },
                { label: '强制', value: '1' }
              ]}
            /> */}
            <Input placeholder="终端型号" />
          </Form.Item>
          <Form.Item prop="packageType" required label="升级包类型">
            <Radiox
              options={[
                { label: '全量', value: '1' },
                { label: '增量', value: '0' }
              ]}
            />
          </Form.Item>
          <Form.Item
            prop="version"
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
