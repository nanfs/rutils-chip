import React from 'react'
import { Form, Input, message } from 'antd'
import { Drawerx, Formx, Radiox, Checkboxx, Title, Diliver } from '@/components'
import { memoryOptions, cpuOptions } from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'
import { required, checkName, lessThanValue } from '@/utils/valid'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = id => {
    this.drawer.show()
    desktopsApi
      .detail(id)
      .then(res => {
        const { data } = res
        const { network } = data
        const networkFix = network.map(
          item => `${item.kind}&${item.vnic}&${item.kindid}`
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

  /**
   *  网络接口字段和创建网络字段是不匹配的 name 等同于 vnic
   *
   * @memberof EditDrawer
   */
  getNetwork = () => {
    const queryClusterId = this.state?.clusterId
    if (!queryClusterId) {
      return Promise.reject().catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
    }
    return desktopsApi
      .getNetwork(queryClusterId)
      .then(res => {
        const network = res.data.records
        const networkOptions = network.map(item => ({
          label: `${item.kind}/${item.name}`,
          value: `${item.kind}&${item.name}&${item.kindid}`
        }))
        this.setState({ networkOptions })
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  /**
   * 编辑网络 TODO网络核对
   *
   * @memberof EditDrawer
   */
  editVm = values => {
    const { network } = values
    const networkFix = network.map((item, index) => {
      const name = `nic${index + 1}`
      const [kind, vnic, kindid] = item.split('&')
      return { kind, vnic, kindid, name }
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
          <Form.Item label="模板">{this.state?.templateName}</Form.Item>
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
              options={this.state?.networkOptions}
            />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
