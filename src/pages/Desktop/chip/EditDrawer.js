import React from 'react'
import { Form, Input, message, Row, Col, Button } from 'antd'
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
          const nets = network?.length
            ? network.map(item => item.kindid)
            : [undefined]
          const netNic = network?.length
            ? network.map(item => +item.vnic.replace('nic', ''))
            : [1]
          const netTopIndex = netNic.sort()[netNic.length - 1]
          this.setState({
            templateName: data.templateName,
            clusterId: data.clusterId,
            nets,
            netNic,
            netTopIndex,
            hasSetNetValue: true
          })
          this.drawer.form.setFieldsValue({ ...data, id, nic: nets })
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
    const nets = this.drawer.form.getFieldValue('nic')
    const { netNic } = this.state
    // const newNets =
    //   nets?.length === 1 ? [''] : [...nets.slice(0, k), ...nets.slice(k + 1)]
    const newNets = [...nets.slice(0, k), ...nets.slice(k + 1)]
    const newNetNic = [...netNic.slice(0, k), ...netNic.slice(k + 1)]
    this.setState({
      nets: newNets,
      netNic: newNetNic
    })
    this.drawer.form.setFieldsValue({ nic: newNets })
  }

  /**
   *
   * 动态添加网卡数量
   * @memberof AddDrawer
   */
  add = () => {
    const nets = this.drawer.form.getFieldValue('nic')
    const newNets = [...nets, undefined]
    const newNetTopIndex = this.state.netTopIndex + 1

    const newNetNic = this.state.netNic.concat(newNetTopIndex)
    if (newNets.length > 5) {
      return false
    }
    this.setState({
      netTopIndex: newNetTopIndex,
      netNic: newNetNic,
      nets: newNets
    })
    this.drawer.form.setFieldsValue({ nic: newNets })
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
    const { nic } = values
    const { netAll } = this.state
    const networkSelected = nic.map(netId =>
      netAll.find(item => item.kindid === netId)
    )
    const { netNic } = this.state
    const networkFix = networkSelected.map((item, index) => ({
      vnic: `nic${netNic[index]}`,
      ...item
    }))
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

  renderNetWork = () => {
    const networks = this.state?.nets
    const netNic = this.state?.netNic
    return (
      networks &&
      networks.map((item, index) => (
        <Row gutter={16} key={index} className="form-item-wrapper">
          <Col span={14}>
            <Form.Item
              prop={`nic[${index}]`}
              label={`nic${netNic[index]}`}
              key={index}
              hidden={!this.state?.hasSetNetValue}
              labelCol={{ sm: { span: 10, pull: 2 } }}
              wrapperCol={{ sm: { span: 14 } }}
            >
              {/* 修改 强制刷新页面 设置disabled */}
              <Selectx
                getData={this.getNetwork}
                showRefresh={false}
                onChange={this.onNetSelect}
                options={this.state?.networkOptions}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button
              icon="minus-circle-o"
              className="dynamic-button"
              disabled={index === 0 && networks.length === 1}
              onClick={() => this.remove(index)}
            />
            <Button
              hidden={index !== networks.length - 1}
              disabled={networks.length >= 5}
              className="dynamic-button"
              icon="plus-circle"
              // 如果实际网卡 已经有5个 或者当前下拉没有值 禁用添加新项
              onClick={() => this.add(index)}
              style={{ marginLeft: 8 }}
            />
          </Col>
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
            <TextArea placeholder="描述" />
          </Form.Item>
          <Diliver />
          <Title slot="网络设置"></Title>
          {this.renderNetWork()}
        </Formx>
      </Drawerx>
    )
  }
}
