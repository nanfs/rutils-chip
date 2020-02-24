import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title, { Diliver } from '@/components/Title'
import Radiox from '@/components/Radiox'
import { usbOptions, memoryOptions, cpuOptions } from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'

const { TextArea } = Input

export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    templateOptions: [],
    networkOptions: [],
    templateLoading: false,
    networkLoading: false
  }

  pop = () => {
    this.drawer.show()
    this.setState({ fetchData: true })
    this.getTemplate()
    this.getNetwork()
  }

  addVm = values => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    desktopsApi
      .addVm({ values })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  // 需要clusetid 还有 id 无奈
  getTemplate = () => {
    this.setState({ templateLoading: true })
    desktopsApi
      .getTemplate({ current: 1, size: 10000 })
      .then(res => {
        const templateOptions = res.data.records.map(item => ({
          label: item.name,
          value: `${item.id}&clusterId${item.clusterId}`
        }))
        this.setState({ templateOptions, templateLoading: false })
      })
      .catch(e => {
        console.log(e)
      })
  }

  onTempalteChange = (a, b, value) => {
    console.log(value)
  }

  getNetwork = () => {
    desktopsApi
      .getNetwork({ current: 1, size: 10000 })
      .then(res => {
        console.log(res)
        this.setState({ networkLoading: false })
      })
      .catch(e => {
        console.log(e)
      })
  }

  render() {
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={this.addVm}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="桌面名称">
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item
            prop="template"
            label="模板"
            hidden={!this.state.fetchData}
          >
            <Radiox
              getData={this.getTemplate}
              options={this.state.templateOptions}
              loading={this.state.templateLoading}
              onChange={this.onTempalteChange}
            />
          </Form.Item>
          <Form.Item prop="usbNum" label="USB数量">
            <Radiox options={usbOptions} />
          </Form.Item>
          <Form.Item
            prop="cpuCore"
            label="CPU"
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox options={cpuOptions} hasInputNumber />
          </Form.Item>
          <Form.Item
            prop="memory"
            label="内存"
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox options={memoryOptions} hasInputNumber />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="" />
          </Form.Item>
          <Diliver />
          <Title slot="网络设置"></Title>
          <Form.Item
            prop="network"
            label="网络"
            wrapperCol={{ sm: { span: 16 } }}
            hidden={!this.state.fetchData}
          >
            <Radiox
              getData={this.getNetwork}
              options={this.state.networkOptions}
              loading={this.state.networkLoading}
            />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
