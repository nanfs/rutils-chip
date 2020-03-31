import React from 'react'
import { Form, Input, message, InputNumber, Select } from 'antd'
import {
  Drawerx,
  Formx,
  Title,
  Radiox,
  Checkboxx,
  Diliver,
  Selectx
} from '@/components'

import { memoryOptions, cpuOptions, diskOptions } from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'
import assetsApi from '@/services/assets'

import { findArrObj } from '@/utils/tool'
import { required, checkName, lessThanValue } from '@/utils/valid'

const { TextArea } = Input
const createType = [
  { label: '通过模板创建', value: '1' },
  {
    label: '通过ISO创建',
    value: '2'
  }
]
const driveType = [
  { label: 'x64', value: 'x64' },
  { label: 'x86', value: 'x86' },
  { label: '不需要', value: '' }
]
const { Option, OptGroup } = Select
export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  // 默认选择通过模板创建, 创建数量1
  pop = () => {
    this.setState({})
    this.drawer.show()
    this.setState({ fetchData: true, networkOptions: [], templateOptions: [] })
    this.drawer.form.setFieldsValue({ desktopNum: 1 })
    this.getCluster()
  }

  // 获取模板列表
  getTemplate = () => {
    return desktopsApi
      .getTemplate({ current: 1, size: 10000, clusterId: this.state.clusterId })
      .then(res => {
        this.setState({ templateArr: res.data.records })
        const templateOptions = res.data.records.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.setState({ templateOptions })
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  // 获取群集 后端可能没有分页
  getCluster = () => {
    return assetsApi
      .clusters({ current: 1, size: 10000, available: 1 })
      .then(res => {
        this.setState({ clusterArr: res.data })
        const clusterOptions = res.data.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.setState({ clusterOptions })
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  getSelectType = () => {
    return (
      this.drawer && this.drawer.form && this.drawer.form.getFieldValue('type')
    )
  }

  getIso = () => {
    const { storagePoolId } = this.state
    return desktopsApi
      .getIso({ storagePoolId })
      .then(res => {
        const win = []
        const linux = []
        const domestic = []
        // TODO ISO命名约定
        res.data.forEach(item => {
          const name = item.repoImageId.toLowerCase()
          if (this.checkIsoType(name) === 'domestic') {
            return domestic.push(item.repoImageId)
          }
          if (name.includes('win')) {
            return win.push(item.repoImageId)
          }
          linux.push(item.repoImageId)
        })
        this.setState({ isos: { win, linux, domestic } })
      })
      .catch(error => {
        this.setState({ networkLoading: false })
        message.error(error.message || error)
      })
  }

  getNetwork = () => {
    return desktopsApi
      .getNetwork(this.state.clusterId)
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
      })
  }

  onTempalteChange = () => {
    this.getNetwork(this.state.clusterId)
  }

  onClusterChange = (a, b, clusterId) => {
    const current = findArrObj(this.state.clusterArr, 'id', clusterId)
    const { storagePoolId } = current
    this.setState({ clusterId, storagePoolId }, () => {
      if (this.getSelectType() === '2') {
        this.getNetwork()
        this.getIso()
      } else {
        this.getTemplate()
        this.getNetwork()
      }
    })
  }

  onCreateTypeChange = (a, b, target) => {
    this.setState({ networkOptions: undefined })
    if (!this.state.clusterId) {
      return
    }
    if (target === '1') {
      this.getTemplate()
      this.getNetwork()
    } else {
      this.getIso()
    }
    this.forceUpdate()
  }

  onIsoChange = (a, b, target) => {
    if (target.toLowerCase().includes('x64')) {
      return this.drawer.form.setFieldsValue({ isoBit: '64' })
    }
    if (target.toLowerCase().includes('x86')) {
      return this.drawer.form.setFieldsValue({ isoBit: '86' })
    }
    this.drawer.form.setFieldsValue({ isoBit: '' })
  }

  checkIsoType(isoName) {
    const demesticKeyWords = ['szwx', 'kylin', 'isoft', 'deepin']
    if (demesticKeyWords.some(item => isoName.includes(item))) {
      return 'domestic'
    }
    if (isoName.includes('win')) {
      return 'windows'
    }
    return 'linux'
  }

  addVm = values => {
    const { type, network, ...rest } = values
    const networkFix = network.map(item => {
      const [kind, name, kindid] = item.split('&')
      return { kind, name, kindid }
    })
    const data = {
      ...rest,
      cpuNum: 1,
      network: networkFix
    }
    // 如果通过ISO创建用户
    if (type === '2') {
      const { isoName } = values
      const isoType = this.checkIsoType(isoName)
      const reqData = { isoType, ...data }
      return desktopsApi
        .addVmByIso(reqData)
        .then(res => {
          this.drawer.afterSubmit(res)
        })
        .catch(errors => {
          this.drawer.break(errors)
          console.log(errors)
        })
    }
    // 如果批量创建调用单独批量创建的接口
    if (values.desktopNum && values.desktopNum > 1) {
      return desktopsApi
        .batchAddVm(data)
        .then(res => {
          this.drawer.afterSubmit(res)
        })
        .catch(errors => {
          this.drawer.break(errors)
          console.log(errors)
        })
    } else {
      // 普通通过模板创建
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

  renderOsOptions = () => {
    return (
      <Selectx
        style={{ width: 230 }}
        placeholder="请选择镜像"
        onChange={this.onIsoChange}
        getData={this.getIso}
      >
        {this.state?.isos?.win && (
          <OptGroup label="windows" key="windows">
            {this.state?.isos?.win?.map(item => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </OptGroup>
        )}
        {this.state?.isos?.linux && (
          <OptGroup label="linux" key="linux">
            {this.state?.isos?.linux?.map(item => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </OptGroup>
        )}
        {this.state?.isos?.domestic && (
          <OptGroup label="国产系统" key="domestic">
            {this.state?.isos?.domestic?.map(item => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </OptGroup>
        )}
      </Selectx>
    )
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
          <Form.Item
            prop="clusterId"
            label="集群"
            required
            rules={[required]}
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox
              getData={this.getCluster}
              options={this.state?.clusterOptions}
              onChange={this.onClusterChange}
            />
          </Form.Item>
          <Form.Item prop="type" required label="创建方式">
            <Radiox options={createType} onChange={this.onCreateTypeChange} />
          </Form.Item>
          <Form.Item
            prop="templateId"
            label="模板"
            required
            rules={this.getSelectType() === '1' ? [required] : undefined}
            wrapperCol={{ sm: { span: 16 } }}
            hidden={this.getSelectType() !== '1'}
          >
            <Radiox
              getData={this.getTemplate}
              options={this.state?.templateOptions}
              onChange={this.onTempalteChange}
            />
          </Form.Item>
          <Form.Item
            prop="isoName"
            label="ISO"
            required
            rules={this.getSelectType() === '2' ? [required] : undefined}
            wrapperCol={{ sm: { span: 16 } }}
            hidden={this.getSelectType() !== '2'}
          >
            {this.renderOsOptions()}
          </Form.Item>
          <Form.Item
            prop="isoBit"
            required
            label="驱动类型"
            hidden={this.getSelectType() !== '2'}
          >
            <Radiox options={driveType} />
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
            hidden={this.getSelectType() !== '2'}
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
            hidden={this.getSelectType() !== '1'}
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
            />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
