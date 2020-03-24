import React from 'react'
import { Form, Input, message, InputNumber, Row, Col, Typography } from 'antd'
import { Drawerx, Formx, Title, Radiox, Checkboxx, Diliver } from '@/components'

import { memoryOptions, cpuOptions, diskOptions } from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'
import assetsApi from '@/services/assets'

import { findArrObj } from '@/utils/tool'
import { required, checkName, lessThanValue } from '@/utils/valid'

const { Text } = Typography
const { TextArea } = Input
const createType = [
  { label: '通过模板创建', value: '1' },
  {
    label: '创建全新虚拟机',
    value: '2'
  }
]
export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  // 默认选择通过模板创建, 创建数量1
  pop = () => {
    this.setState({})
    this.drawer.show()
    this.setState({ fetchData: true, networkOptions: [], templateOptions: [] })
    this.drawer.form.setFieldsValue({ type: '1', desktopNum: 1 })
    this.getTemplate()
  }

  // 添加虚拟机 通过镜像创建虚拟机传递需要给后端空白模板
  addVm = values => {
    const { type, network, ...rest } = values
    const networkFix = network.map(item => {
      const [kind, name, kindid] = item.split('&')
      return { kind, name, kindid }
    })
    const data = {
      ...rest,
      cpuNum: 1,
      template: type === '2' ? 'Blank' : undefined,
      network: networkFix
    }
    // 如果批量创建调用单独批量创建的接口
    if (values.desktopNum && values.desktopNum > 1) {
      desktopsApi
        .batchAddVm(data)
        .then(res => {
          this.drawer.afterSubmit(res)
        })
        .catch(errors => {
          this.drawer.break(errors)
          console.log(errors)
        })
    } else {
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
  }

  // 获取模板列表
  getTemplate = () => {
    this.setState({ templateLoading: true })
    desktopsApi
      .getTemplate({ current: 1, size: 10000 })
      .then(res => {
        this.setState({ templateArr: res.data.records })
        const templateOptions = res.data.records.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.setState({ templateOptions, templateLoading: false })
      })
      .catch(error => {
        this.setState({ templateLoading: false })
        message.error(error.message || error)
        console.log(error)
      })
  }

  // 获取群集 后端可能没有分页
  getCluster = () => {
    this.setState({ clusterLoading: true })
    assetsApi
      .clusters({ current: 1, size: 10000 })
      .then(res => {
        const clusterOptions = res.data.records.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.setState({ clusterOptions, clusterLoading: false })
      })
      .catch(error => {
        this.setState({ clusterLoading: false })
        message.error(error.message || error)
        console.log(error)
      })
  }

  onTempalteChange = (a, b, value) => {
    const current = findArrObj(this.state.templateArr, 'id', value)
    console.log('current', current)
    const { os, description, clusterId } = current
    this.setState({ clusterId, os, description }, () =>
      this.getNetwork(clusterId)
    )
  }

  onClusterChange = (a, b, clusterId) => {
    this.setState({ clusterId }, () => this.getNetwork(clusterId))
  }

  onCreateTypeChange = (a, b, target) => {
    this.setState({ networkOptions: undefined })
    if (target === '1') {
      this.getTemplate()
    } else {
      this.getCluster()
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
      return Promise.reject().catch(error => {
        message.error(error.message || error)
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
          <Form.Item prop="type" required label="创建方式">
            <Radiox options={createType} onChange={this.onCreateTypeChange} />
          </Form.Item>
          <Row
            hidden={this.getSelectType() === '1'}
            style={{ margin: '-24px 0px 5px 0px' }}
          >
            <Col span={16} offset={5}>
              <Text type="secondary">
                选择创建全新虚拟机,请在创建后选择安装操作系统
              </Text>
            </Col>
          </Row>
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
              options={this.state?.templateOptions}
              loading={this.state?.templateLoading}
              onChange={this.onTempalteChange}
            />
          </Form.Item>
          <Form.Item
            prop="clusterId"
            label="集群"
            required
            rules={this.getSelectType() === '2' ? [required] : undefined}
            wrapperCol={{ sm: { span: 16 } }}
            hidden={this.getSelectType() === '1'}
          >
            <Radiox
              getData={this.getCluster}
              options={this.state?.clusterOptions}
              loading={this.state?.clusterLoading}
              onChange={this.onClusterChange}
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
          <Form.Item
            prop="disk"
            label="磁盘(G)"
            required
            hidden={this.getSelectType() === '1'}
            rules={
              this.getSelectType() === '2'
                ? [required, lessThanValue(10000)]
                : undefined
            }
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox
              options={diskOptions}
              hasInputNumber
              numProps={{ max: 10000, min: 1 }}
            />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="" />
          </Form.Item>
          <Form.Item
            prop="desktopNum"
            label="创建数量"
            required
            hidden={this.getSelectType() === '2'}
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
            hidden={!this.state?.fetchData}
          >
            <Checkboxx
              getData={this.getNetwork}
              options={this.state?.networkOptions}
              loading={this.state?.networkLoading}
            />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
