import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { Drawerx, Formx, Radiox, Checkboxx, Title, Diliver } from '@/components'
import { memoryOptions, cpuOptions } from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'
import { required, checkName, lessThanValue } from '@/utils/valid'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    templateOption: [],
    networkOption: [],
    initValues: {},
    templateName: undefined,
    networkLoading: false
  }

  pop = id => {
    this.drawer.show()
    desktopsApi
      .detail(id)
      .then(res => {
        const { data } = res
        const { network } = data
        const networkFix = network.map(
          item => `${item.kind}&${item.name}&${item.kindid}`
        )
        this.setState({
          templateName: data.templateName,
          clusterId: data.clusterId
        })
        this.drawer.form.setFieldsValue({ ...data, id, network: networkFix })

        this.getNetwork()
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  getNetwork = () => {
    const queryClusterId = this.state.clusterId
    this.setState({ networkLoading: true })
    if (!queryClusterId) {
      this.setState({ networkLoading: false })
      return Promise.reject().catch(error => {
        message.error(error.message || error)
        console.log(error)
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
      .catch(error => {
        this.setState({ networkLoading: false })
        message.error(error.message || error)
        console.log(error)
      })
  }

  editVm = values => {
    const { network } = values
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    const networkFix = network.map(item => {
      const [kind, name, kindid] = item.split('&')
      return { kind, name, kindid }
    })
    desktopsApi
      .editVm({ ...values, network: networkFix })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(error => {
        this.drawer.break(error)
        console.log(error)
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
        onOk={this.editVm}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="id" hidden>
            <Input placeholder="id" />
          </Form.Item>
          <Form.Item prop="cpuNum" hidden>
            <Input placeholder="cpuNum" />
          </Form.Item>
          <Form.Item
            prop="name"
            label="桌面名称"
            required
            rules={[required, checkName]}
          >
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item label="模板">
            <Button>{this.state.templateName}</Button>
          </Form.Item>
          {/* <Form.Item prop="usbNum" label="USB数量">
            <Radiox options={usbOptions} />
          </Form.Item> */}
          <Form.Item
            prop="cpuCores"
            label="CPU"
            required
            rules={[required, lessThanValue(160)]}
            wrapperCol={{ sm: { span: 12 } }}
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
          <Form.Item prop="network" label="网络">
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
