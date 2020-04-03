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
  { label: '通过模板创建', value: 'byTemp' },
  {
    label: '通过ISO创建',
    value: 'byIso'
  }
]
const driveType = [
  { label: 'x64', value: '64' },
  { label: 'x86', value: '32' },
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

  getSelectType = () => {
    return (
      this.drawer && this.drawer.form && this.drawer.form.getFieldValue('type')
    )
  }

  // 获取模板列表 传入集群ID 模板状态
  getTemplate = () => {
    return desktopsApi
      .getTemplate({
        current: 1,
        size: 10000,
        clusterId: this.state.clusterId,
        statusIsOk: 1
      })
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

  /**
   *
   *判断 ISO是属于 国产 还是 windows linux 三类
   * @param {*} isoName
   * @returns
   * @memberof AddDrawer
   */
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

  /**
   *
   * 获取ISO列表 判断 加入到对应列表
   * @memberof AddDrawer
   */
  getIso = () => {
    const { storagePoolId } = this.state
    return desktopsApi
      .getIso({ storagePoolId })
      .then(res => {
        const win = []
        const linux = []
        const domestic = []
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
        message.error(error.message || error)
      })
  }

  // 网络接口字段和创建网络字段是不匹配的 name 等同于 vnic
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

  // 当模板变化的时候 TODO 获取模板信息显示
  onTempalteChange = () => {}

  /**
   * 当集群变化的时候 如果是iso 拉取iso 和网络
   * 如果 不是 就默认拉取网络和模板
   *
   * @memberof AddDrawer
   */
  onClusterChange = (a, b, clusterId) => {
    const current = findArrObj(this.state.clusterArr, 'id', clusterId)
    const { storagePoolId } = current
    this.setState({ clusterId, storagePoolId }, () => {
      if (this.getSelectType() === 'byIso') {
        this.getNetwork()
        this.getIso()
      } else {
        this.getTemplate()
        this.getNetwork()
      }
    })
  }

  /**
   * 操作如上  应对用户选择之前没有选择集群ID
   *
   * @memberof AddDrawer
   */
  onCreateTypeChange = (a, b, target) => {
    if (!this.state.clusterId) {
      this.setState({ networkOptions: undefined })
      return
    }
    if (target === 'byTemp') {
      this.getTemplate()
    } else {
      this.getIso()
    }
    this.forceUpdate()
  }

  /**
   * 当ISO改变的时候 后端需要判断 32 还是 64 位
   *
   * @memberof AddDrawer
   */
  onIsoChange = (a, b, target) => {
    if (target.toLowerCase().includes('x64')) {
      return this.drawer.form.setFieldsValue({ isoBit: '64' })
    }
    if (target.toLowerCase().includes('x86')) {
      return this.drawer.form.setFieldsValue({ isoBit: '32' })
    }
    this.drawer.form.setFieldsValue({ isoBit: '' })
  }

  /**
   * 约定 创建最大 磁盘2000G
   * 最大 内存 128G
   *
   * @memberof AddDrawer
   */
  addVm = values => {
    const { type, network, ...rest } = values
    const networkFix = network.map((item, index) => {
      const name = `nic${index + 1}`
      const [kind, vnic, kindid] = item.split('&')
      return { kind, vnic, kindid, name }
    })
    const data = {
      ...rest,
      cpuNum: 1,
      network: networkFix
    }
    // 如果通过ISO创建用户
    if (type === 'byIso') {
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
        style={{ width: 350 }}
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
            rules={this.getSelectType() === 'byTemp' ? [required] : undefined}
            wrapperCol={{ sm: { span: 16 } }}
            hidden={this.getSelectType() !== 'byTemp'}
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
            rules={this.getSelectType() === 'byIso' ? [required] : undefined}
            wrapperCol={{ sm: { span: 16 } }}
            hidden={this.getSelectType() !== 'byIso'}
          >
            {this.renderOsOptions()}
          </Form.Item>
          <Form.Item
            prop="isoBit"
            required
            label="驱动类型"
            hidden={this.getSelectType() !== 'byIso'}
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
            rules={[required, lessThanValue(128)]}
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox
              options={memoryOptions}
              hasInputNumber
              numProps={{ max: 100, min: 1 }}
            />
          </Form.Item>
          <Form.Item
            prop="capacity"
            label="磁盘(G)"
            required
            hidden={this.getSelectType() !== 'byIso'}
            rules={
              this.getSelectType() === 'byIso'
                ? [required, lessThanValue(10000)]
                : undefined
            }
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox
              options={diskOptions}
              hasInputNumber
              numProps={{ max: 2000, min: 1 }}
            />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="" />
          </Form.Item>
          {/* 默认创建最多100台 */}
          <Form.Item
            prop="desktopNum"
            label="创建数量"
            required
            hidden={this.getSelectType() !== 'byTemp'}
            rules={[required, lessThanValue(100)]}
          >
            <InputNumber placeholder="" min={1} max={100} />
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
