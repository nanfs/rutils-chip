import React from 'react'
import { Form, Input, message, InputNumber } from 'antd'
import { Drawerx, Formx, Title, Radiox, Checkboxx, Diliver } from '@/components'

import { memoryOptions, cpuOptions } from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'
import { required, checkName, lessThanValue } from '@/utils/valid'

const { TextArea } = Input
const createType = [
  { label: '通过模板创建', value: '1' },
  {
    label: '通过镜像创建',
    value: '2'
  }
]
export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    templateLoading: false,
    networkLoading: false
  }

  pop = () => {
    this.drawer.show()
    this.setState({ fetchData: true, networkOptions: [], templateOptions: [] })
    console.log(this.drawer.form.setFieldsValue({ type: '1', desktopNum: 1 }))
    this.getTemplate()
  }

  addVm = values => {
    const { templateId, network } = values
    const templateFix = templateId.split('&clusterId')[0]
    const networkFix = network.map(item => {
      const [kind, name, kindid] = item.split('&')
      return { kind, name, kindid }
    })

    const data = {
      ...values,
      cpuNum: 1,
      templateId: templateFix,
      network: networkFix
    }
    desktopsApi
      .addVm(data)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
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
      .catch(errors => {
        message.error(errors)
        console.log(errors)
      })
  }

  // 需要clusetid 还有 id 无奈
  getIso = () => {
    this.setState({ isoLoading: true })
    desktopsApi
      .getIso({ current: 1, size: 10000 })
      .then(res => {
        const isoOptions = res.data.records.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.setState({ isoOptions, isoLoading: false })
      })
      .catch(errors => {
        message.error(errors)
        console.log(errors)
      })
  }

  onTempalteChange = (a, b, value) => {
    const clusterId = value.split('&clusterId')[1]
    this.setState({ clusterId }, () => this.getNetwork(clusterId))
  }

  onCreateTypeChange = (a, b, target) => {
    console.log('onCreateTypeChange', target)
    if (target === '1') {
      this.getTemplate()
    } else {
      this.getIso()
    }
    this.forceUpdate()
  }

  getSelectType = () => {
    return (
      this.drawer && this.drawer.form && this.drawer.form.getFieldValue('type')
    )
  }

  getNetwork = () => {
    const queryClusterId = this.state.clusterId
    this.setState({ networkLoading: true })
    if (!queryClusterId) {
      this.setState({ networkLoading: false })
      message.error('请先选择模板')
      return Promise.reject().catch(errors => {
        console.log(errors)
      })
    }
    desktopsApi
      .getNetwork(queryClusterId)
      .then(res => {
        const network = res.data.records
        const networkOptions = network.map(item => ({
          label: `${item.kind}/${item.name}`,
          value: `${item.kind}&${item.name}&${item.kindid}`
        }))
        this.setState({ networkOptions, networkLoading: false })
      })
      .catch(errors => {
        this.setState({ networkLoading: false })
        message.error(errors)
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
          <Form.Item
            prop="name"
            label="桌面名称"
            required
            rules={[required, checkName]}
          >
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item prop="type" required label="准入方式">
            <Radiox options={createType} onChange={this.onCreateTypeChange} />
          </Form.Item>
          <Form.Item
            prop="templateId"
            label="模板"
            required
            rules={this.getSelectType() === '1' ? [required] : undefined}
            wrapperCol={{ sm: { span: 16 } }}
            hidden={this.getSelectType() === '2'}
          >
            <Radiox
              getData={this.getTemplate}
              options={this.state.templateOptions}
              loading={this.state.templateLoading}
              onChange={this.onTempalteChange}
            />
          </Form.Item>
          <Form.Item
            prop="isoId"
            label="镜像"
            required
            rules={this.getSelectType() === '2' ? [required] : undefined}
            wrapperCol={{ sm: { span: 16 } }}
            hidden={this.getSelectType() === '1'}
          >
            <Radiox
              getData={this.getIso}
              options={this.state.isoOptions}
              loading={this.state.isoLoading}
            />
          </Form.Item>
          <Form.Item
            prop="cpuCores"
            label="CPU"
            required
            rules={[required, lessThanValue(160)]}
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox
              options={cpuOptions}
              hasInputNumber
              numProps={{ max: 160, min: 1 }}
            />
          </Form.Item>
          <Form.Item
            prop="memory"
            label="内存"
            required
            rules={[required, lessThanValue(100)]}
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox
              options={memoryOptions}
              hasInputNumber
              numProps={{ max: 100, min: 1 }}
            />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="" />
          </Form.Item>
          <Form.Item
            prop="desktopNum"
            label="创建数量"
            required
            rules={[required, lessThanValue(20)]}
          >
            <InputNumber placeholder="" min={1} max={20} />
          </Form.Item>
          <Diliver />
          <Title slot="网络设置"></Title>
          <Form.Item
            prop="network"
            label="网络"
            required
            rules={[required]}
            wrapperCol={{ sm: { span: 16 } }}
            hidden={!this.state.fetchData}
          >
            <Checkboxx
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
