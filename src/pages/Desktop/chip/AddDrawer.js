import React from 'react'
import { Form, Input } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title, { Diliver } from '@/components/Title'
import Radiox from '@/components/Radiox'
import Checkboxx from '@/components/Checkboxx'

import { memoryOptions, cpuOptions } from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'
import { required, checkName, lessThanValue } from '@/utils/valid'

const { TextArea } = Input

export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    templateOptions: [],
    networkOptions: [],
    networks: [],
    clusterId: undefined,
    templateLoading: false,
    networkLoading: false
  }

  pop = () => {
    this.drawer.show()
    this.setState({ fetchData: true })
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
    console.log('data', data)
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    desktopsApi
      .addVm(data)
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
    const clusterId = value.split('&clusterId')[1]
    this.setState({ clusterId }, () => this.getNetwork(clusterId))
  }

  getNetwork = () => {
    const queryClusterId = this.state.clusterId
    this.setState({ networkLoading: true })
    if (!queryClusterId) {
      this.setState({ networkLoading: false })
      return Promise.reject().catch(e => {
        console.log(e)
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
      .catch(e => {
        this.setState({ networkLoading: false })
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
          <Form.Item
            prop="name"
            label="桌面名称"
            required
            rules={[required, checkName]}
          >
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item prop="templateId" label="模板" requiredrules={[required]}>
            <Radiox
              getData={this.getTemplate}
              options={this.state.templateOptions}
              loading={this.state.templateLoading}
              onChange={this.onTempalteChange}
            />
          </Form.Item>
          {/* <Form.Item prop="usbNum" label="USB数量" rules={[required]}>
            <Radiox options={usbOptions} />
          </Form.Item> */}
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
