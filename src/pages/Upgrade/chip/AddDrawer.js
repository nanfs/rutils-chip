import React from 'react'
import { Form, Input, Upload, Button } from 'antd'
import { Drawerx, Formx, Radiox, Title, Uploadx, Reminder } from '@/components'
import { required, version } from '@/utils/valid'

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
    this.drawer.form.setFieldsValue({
      priorityLevel: '0',
      packageType: '1'
    })
  }

  addUpgrade = values => {
    upgrade
      .addUpgrade({ ...values, file: this.state.file, name: this.state.name })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
      })
  }

  fileChange = (fileList, name) => {
    this.setState({ file: fileList[0], name })
    this.drawer.form.setFieldsValue({
      model: name.split('_')[2],
      version: name
        .split('_')[3]
        .substring(0, name.split('_')[3].lastIndexOf('.'))
    })
  }

  checkName = name => {
    const re = new RegExp(
      '^([1-9]{1}[0-9]{0,1}|[1-9]{1})\\.([1-9]{1}[0-9]{0,1}|[0-9]{1})\\.([1-9]{1}[0-9]{0,1}|[0-9]{1})$'
    )
    if (name.split('_').length !== 4 || name.split('_')[1] !== 'tc') {
      return '上传文件命名格式错误'
    } else if (
      !re.test(
        name.split('_')[3].substring(0, name.split('_')[3].lastIndexOf('.'))
      )
    ) {
      return '上传文件版本号格式错误'
    } else return true
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
          {/* <Form.Item prop="name" label="升级包名称" required rules={[required]}>
            <Input placeholder="升级包名称" />
          </Form.Item> */}
          <Form.Item
            prop="package"
            label={
              <span>
                上传升级包
                <Reminder
                  tips="升级包命名规则：名称_tc_型号_版本号.zip，版本号格式：x.x.x，升级包大小不能超过100M"
                  iconStyle={{ fontSize: 20 }}
                  placement="bottomLeft"
                ></Reminder>
              </span>
            }
            required
            rules={[required]}
          >
            <Uploadx
              hasInput
              action=""
              fileChange={this.fileChange}
              acceptType=".zip"
              maxSize="102400000"
              checkName={this.checkName}
            />
          </Form.Item>
          <Form.Item
            prop="priorityLevel"
            required
            label="优先级"
            rules={[required]}
          >
            <Radiox
              options={[
                { label: '非强制', value: '0' },
                { label: '强制', value: '1', disabled: true }
              ]}
            />
          </Form.Item>
          <Form.Item prop="model" required label="终端型号" rules={[required]}>
            <Input
              placeholder="未上传升级包"
              style={{ border: 'none', background: ' #fff', color: '#000' }}
              disabled
            />
          </Form.Item>
          <Form.Item
            prop="packageType"
            required
            label="升级包类型"
            rules={[required]}
          >
            <Radiox
              options={[
                { label: '全量', value: '1' },
                { label: '增量', value: '0', disabled: true }
              ]}
            />
          </Form.Item>
          <Form.Item
            prop="version"
            label="升级包版本"
            required
            rules={[required, version]}
          >
            <Input
              placeholder="未上传升级包"
              style={{ border: 'none', background: ' #fff', color: '#000' }}
              disabled
            />
          </Form.Item>
          <Form.Item prop="log" label="升级日志">
            <TextArea rows={4} placeholder="升级日志" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}