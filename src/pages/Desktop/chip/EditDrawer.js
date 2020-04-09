import React from 'react'
import { Form, Input, message, Row, Col, Icon } from 'antd'
import { Drawerx, Formx, Radiox, Selectx, Title, Diliver } from '@/components'
import { memoryOptions, cpuOptions } from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'
import { required, checkName, lessThanValue } from '@/utils/valid'
import { wrapResponse } from '@/utils/tool'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  /**
   *
   *hasSetNetValue 用于显示 网络动态加载 抖动
   * @memberof EditDrawer
   */
  pop = id => {
    this.drawer.show()
    desktopsApi.detail(id).then(res =>
      wrapResponse(res)
        .then(() => {
          const { data } = res
          const { network } = data
          const nets = network?.length ? network.map(item => item.kindid) : ['']
          this.setState({
            templateName: data.templateName,
            clusterId: data.clusterId,
            nets,
            hasSetNetValue: true
          })
          this.drawer.form.setFieldsValue({ ...data, id, network: nets })
          this.getNetwork()
        })
        .catch(error => {
          message.error(error.message || error)
          console.log(error)
        })
    )
  }

  /**
   *
   *
   * @memberof AddDrawer
   */
  remove = k => {
    const nets = this.drawer.form.getFieldValue('network')
    const newNets =
      nets?.length === 1 ? [''] : [...nets.slice(0, k), ...nets.slice(k + 1)]
    this.setState({
      nets: newNets
    })
    this.drawer.form.setFieldsValue({ network: newNets })
  }

  /**
   *
   * 动态添加网卡数量
   * @memberof AddDrawer
   */
  add = index => {
    if (index > 4) {
      return false
    }
    const nets = this.drawer.form.getFieldValue('network')
    const newNets = [...nets, '']
    this.setState({
      nets: newNets
    })
    this.drawer.form.setFieldsValue({ network: newNets })
  }

  /**
   *  网络接口字段和创建网络字段是不匹配的 name 等同于 vnic
   *
   * @memberof EditDrawer
   */
  getNetwork = () => {
    return desktopsApi.getNetwork(this.state.clusterId).then(res =>
      wrapResponse(res)
        .then(() => {
          const network = res.data.records
          const networkOptions = network.map(item => ({
            label: `${item.kind}/${item.name}`,
            value: item.kindid
          }))
          this.setState({ networkOptions, netAll: network })
        })
        .catch(error => {
          message.error(error.message || error)
        })
    )
  }

  /**
   * 编辑网络 TODO网络核对
   *
   * @memberof EditDrawer
   */
  editVm = values => {
    const { network } = values
    const { netAll } = this.state
    const networkSelected = network?.map(netId =>
      netAll.find(item => item.kindid === netId)
    )
    desktopsApi
      .editVm({ ...values, network: networkSelected })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(error => {
        this.drawer.break(error)
        console.log(error)
      })
  }

  renderNetWork = () => {
    const networks = this.state?.nets
    return (
      networks &&
      networks.map((item, index) => (
        <Row gutter={16} key={index} className="form-item-wrapper">
          <Col span={14}>
            <Form.Item
              prop={`network[${index}]`}
              label={index === 0 ? `网络` : ''}
              key={index}
              rules={index === 0 ? undefined : [required]}
              labelCol={{ sm: { span: 7 } }}
              wrapperCol={{ sm: { push: index === 0 ? 1 : 8, span: 16 } }}
              hidden={!this.state?.hasSetNetValue}
            >
              <Selectx
                getData={this.getNetwork}
                showRefresh={false}
                options={this.state?.networkOptions}
              />
            </Form.Item>
          </Col>
          {index === networks.length - 1 ? (
            <Col span={3}>
              <Icon
                className="dynamic-button"
                type="minus-circle-o"
                onClick={() => this.remove(index)}
              />
              <Icon
                className="dynamic-button"
                type="plus-circle"
                disabled={index >= 4}
                onClick={() => this.add(index)}
                style={{ marginLeft: 8 }}
              />
            </Col>
          ) : (
            <Col span={3}>
              <Icon
                className="dynamic-button"
                type="minus-circle-o"
                onClick={() => this.remove(index)}
              />
            </Col>
          )}
        </Row>
      ))
    )
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
            label="CPU(核)"
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
            label="内存(G)"
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
          {this.renderNetWork()}
        </Formx>
      </Drawerx>
    )
  }
}
