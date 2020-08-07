import React from 'react'
import {
  Form,
  Input,
  message,
  InputNumber,
  Select,
  Row,
  Col,
  Icon,
  Button,
  Tooltip
} from 'antd'
import {
  Drawerx,
  Formx,
  Title,
  Radiox,
  Diliver,
  Selectx,
  Reminder
} from '@/components'

import {
  memoryOptions,
  cpuOptions,
  diskOptions,
  osSelectOptions
} from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'
import assetsApi from '@/services/assets'

import { findArrObj, wrapResponse } from '@/utils/tool'
import {
  required,
  checkName,
  lessThanValue,
  notUndefined,
  isInt
} from '@/utils/valid'

const { TextArea } = Input
const createType = [
  { label: '通过模板创建', value: 'byTemp' },
  {
    label: '通过ISO创建',
    value: 'byIso'
  }
]
const driveType = [
  { label: '64', value: '64' },
  { label: '32', value: '32' }
]
const { Option, OptGroup } = Select
export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  // 默认选择通过模板创建, 创建数量1
  pop = initValues => {
    this.setState({})
    this.drawer.show()
    this.setState({
      networkOptions: [],
      templateOptions: [],
      clusterId: null,
      nets: [undefined],
      netTopIndex: 1,
      netNic: [1], // 当前可用网络数量
      hasSetNetValue: true
    })
    this.drawer.form.setFieldsValue({
      ...initValues,
      desktopNum: 1,
      memory: 2,
      cpuCores: 2,
      capacity: 100
    })
    // 在第一次获取集群后 设置默认值第一个集群
    this.getCluster().then(() => {
      const { clusterOptions } = this.state
      if (clusterOptions && clusterOptions[0].value) {
        this.drawer.form.setFieldsValue({
          clusterId: clusterOptions[0].value
        })
        this.onClusterChange('', '', clusterOptions[0].value)
      }
    })
  }

  getNicValue(index) {
    return (
      this.drawer?.form?.getFieldValue('nic') &&
      this.drawer?.form?.getFieldValue('nic')[index]
    )
  }

  /**
   *
   * 通过netNic来保存 虚拟网卡编号
   * 空网卡场景
   * @memberof AddDrawer
   */
  remove = k => {
    const nets = this.drawer.form.getFieldValue('nic')
    const { netNic } = this.state
    const newNets =
      nets.length === 1
        ? [undefined]
        : [...nets.slice(0, k), ...nets.slice(k + 1)]
    const newNetNic =
      nets.length === 1
        ? netNic
        : [...netNic.slice(0, k), ...netNic.slice(k + 1)]
    console.log(newNets, newNetNic)
    this.setState({
      nets: newNets,
      netNic: newNetNic
    })
    this.drawer.form.setFieldsValue({ nic: newNets })
  }

  /**
   *
   * 动态添加网卡数量
   * 通过netNic来保存 虚拟网卡编号
   * @memberof AddDrawer
   */
  add = () => {
    const nets = this.drawer.form.getFieldValue('nic')
    const newNets = [...nets, null]
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
      .then(res =>
        wrapResponse(res)
          .then(() => {
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
      )
  }

  // 获取群集 后端可能没有分页
  getCluster = () => {
    return assetsApi
      .clusters({ current: 1, size: 10000, available: 1 })
      .then(res =>
        wrapResponse(res)
          .then(() => {
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
      )
  }

  /**
   *
   *判断 ISO是属于 国产 还是 windows linux 三类
   * @param {*} isoName
   * @returns
   * @memberof AddDrawer
   */
  checkIsoType(isoName) {
    const demesticKeyWords = [
      'szwx',
      'kylin',
      'isoft',
      'deepin',
      'cmge',
      'uos-',
      'euleros',
      'uniontechos'
    ]
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
    const { storagePoolId, cpuName } = this.state
    if (!storagePoolId) {
      return message.error('请先选择集群')
    }
    return desktopsApi.getIso({ storagePoolId }).then(res =>
      wrapResponse(res)
        .then(() => {
          // SW适配 暂时普华的系统
          if (cpuName === 'SW1621') {
            const swISO = []
            const swLiveImg = []
            res.data.forEach(item => {
              const name = item.repoImageId.toLowerCase()
              if (name.includes('sw_64') && name.includes('.live.img')) {
                return swLiveImg.push(item.repoImageId)
              }
              if (name.includes('sw_64')) {
                return swISO.push(item.repoImageId)
              }
            })
            return this.setState({ isos: { swISO }, swLiveImg })
          }
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
    )
  }

  // 网络接口字段和创建网络字段是不匹配的 name 等同于 vnic
  getNetwork = () => {
    return desktopsApi.getNetwork(this.state.clusterId).then(res =>
      wrapResponse(res)
        .then(() => {
          const network = res.data.records
          const networkOptions = network.map(item => ({
            label: `${item.kind}/${item.name}`,
            value: item.kindid
          }))
          networkOptions.push({ label: '空网卡', value: null })
          this.setState({ networkOptions, netAll: network })
        })
        .catch(error => {
          message.error(error.message || error)
        })
    )
  }

  // 当模板变化的时候 TODO 获取模板信息显示
  onTempalteChange = () => {}

  /**
   * 当集群变化的时候 如果是iso 拉取iso 和网络
   * 如果 不是 就默认拉取网络和模板
   * SW适配 获取集群的cpu架构
   *
   * @memberof AddDrawer
   */
  onClusterChange = (a, b, clusterId) => {
    const current = findArrObj(this.state.clusterArr, 'id', clusterId)
    const { storagePoolId, cpuName } = current
    this.drawer.form.setFieldsValue({
      templateId: undefined,
      isoName: undefined,
      initrdUrl: undefined
    })
    this.setState({ clusterId, storagePoolId, cpuName }, () => {
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
    this.drawer.form.setFieldsValue({
      templateId: undefined,
      isoName: undefined,
      initrdUrl: undefined
    })
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
   * 只有当ISO 为windows 类型的时候 设置
   * 不能直接判断 名称里面是否是x86 x64 linux名称 不符合规则
   * @memberof AddDrawer
   */
  onIsoChange = (a, b, target) => {
    const isoType = this.checkIsoType(target.toLowerCase())
    this.setState({ isoType })
    if (isoType === 'windows') {
      if (target.toLowerCase().includes('x64')) {
        return this.drawer.form.setFieldsValue({ isoBit: '64' })
      }
      if (target.toLowerCase().includes('x86')) {
        return this.drawer.form.setFieldsValue({ isoBit: '32' })
      }
    }
    if (isoType === 'domestic') {
      if (target.toLowerCase().includes('szwx')) {
        return this.drawer.form.setFieldsValue({ isoBit: '64' })
      }
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
    const { type, nic, ...rest } = values
    const { netAll } = this.state
    const networkSelected = nic
      .filter(item => item !== undefined)
      .map(netId => netAll.find(item => item.kindid === netId))

    const { netNic } = this.state
    const networkFix = networkSelected.map((item, index) => ({
      vnic: `nic${netNic[index]}`,
      ...item
    }))
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
    // 都是异步接口 取消单独调用单个
    return desktopsApi
      .batchAddVm(data)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
        console.log(errors)
      })
  }

  renderImgOptions = () => {
    return (
      <Selectx
        style={{ width: '90%' }}
        placeholder="请选择镜像"
        getData={this.getIso}
      >
        {this.state?.swLiveImg && (
          <OptGroup label="适配申威系统" key="swISO">
            {this.state?.swLiveImg?.map(item => (
              <Option value={`iso://${item}`} key={item}>
                {item}
              </Option>
            ))}
          </OptGroup>
        )}
      </Selectx>
    )
  }

  renderOsOptions = () => {
    return (
      <Selectx
        style={{ width: '90%' }}
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
          <OptGroup label="linux或其他" key="linux">
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
        {this.state?.isos?.swISO && (
          <OptGroup label="适配申威系统" key="swISO">
            {this.state?.isos?.swISO?.map(item => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </OptGroup>
        )}
      </Selectx>
    )
  }

  renderNetWork = () => {
    const networks = this.state?.nets
    const netNic = this.state?.netNic
    return (
      networks &&
      networks.map((item, index) => (
        <Row gutter={16} key={index}>
          <Col span={12}>
            <Form.Item
              prop={`nic[${index}]`}
              label={`nic${netNic[index]}`}
              key={index}
              hidden={!this.state?.hasSetNetValue}
              rules={
                index === 0 && networks.length === 1
                  ? undefined
                  : [notUndefined]
              }
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
        onOk={this.addVm}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          {/* <Alert
            message="支持通过模板和ISO创建虚拟机，使用模板创建可以创建多个虚拟机。CPU数量最大支持160、内存容量最大支持128G、网络设置中最多可添加5个配置集。支持申威架构虚拟机创建。"
            type="info"
            showIcon
          /> */}
          <Title slot="基础设置">
            <Reminder
              style={{ marginLeft: -5 }}
              tips="支持通过模板或ISO创建虚拟机，使用模板可以批量创建虚拟机。支持申威架构虚拟机创建。"
            ></Reminder>
          </Title>
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
          <Form.Item
            prop="type"
            required
            rules={[required]}
            label={
              <span>
                创建方式
                <Reminder
                  tips="支持通过模板或ISO创建虚拟机，使用模板可以批量创建虚拟机。"
                  iconStyle={{ fontSize: 20 }}
                  placement="bottomLeft"
                ></Reminder>
              </span>
            }
            hidden={!this.state?.clusterId}
          >
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
              showExpand
              onChange={this.onTempalteChange}
            />
          </Form.Item>
          {/* SW适配 */}
          <Form.Item
            prop="isoName"
            label={this.state?.cpuName !== 'SW1621' ? 'ISO' : '附加CD'}
            required
            rules={this.getSelectType() === 'byIso' ? [required] : undefined}
            wrapperCol={{ sm: { span: 8 } }}
            hidden={
              (this.getSelectType() === 'byTemp' &&
                this.state?.cpuName !== 'SW1621') ||
              !this.getSelectType()
            }
          >
            {this.renderOsOptions()}
          </Form.Item>
          <Form.Item
            prop="initrdUrl"
            label="附加initrd"
            required
            rules={
              this.getSelectType() === 'byIso' &&
              this.state?.cpuName === 'SW1621'
                ? [required]
                : undefined
            }
            wrapperCol={{ sm: { span: 8 } }}
            hidden={
              this.getSelectType() !== 'byIso' ||
              this.state?.cpuName !== 'SW1621'
            }
          >
            {this.renderImgOptions()}
          </Form.Item>
          {/* 如果isoType 不是windows 或者创建方式 不是iso 不显示 */}
          <Form.Item
            prop="isoBit"
            required
            label={
              <span>
                系统位数&nbsp;
                <Tooltip title="安装windows操作系统的时候，64位操作系统请选择“64”，32位操作系统请选择“32”">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
            hidden={
              this.getSelectType() !== 'byIso' ||
              this.state?.isoType !== 'windows'
            }
          >
            <Radiox options={driveType} />
          </Form.Item>
          {/* <Form.Item
            prop="osId"
            required
            hidden={!this.getSelectType()}
            label="操作系统类型"
            rules={[required]}
          >
            <Selectx
              style={{ width: '90%' }}
              placeholder="请选择操作系统类型"
              options={osSelectOptions}
            ></Selectx>
          </Form.Item> */}
          <Form.Item
            prop="cpuCores"
            label={
              <span>
                CPU(核)
                <Reminder
                  tips="CPU数量最大支持160核"
                  iconStyle={{ fontSize: 20 }}
                  placement="bottomLeft"
                ></Reminder>
              </span>
            }
            required
            rules={[required, lessThanValue(160), isInt]}
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
            label={
              <span>
                内存(G)
                <Reminder
                  tips="内存容量最大支持128G"
                  iconStyle={{ fontSize: 20 }}
                  placement="bottomLeft"
                ></Reminder>
              </span>
            }
            required
            rules={[required, lessThanValue(128), isInt]}
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
                ? [required, lessThanValue(10000), isInt]
                : undefined
            }
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox
              options={diskOptions}
              hasInputNumber
              numProps={{ max: 2000, min: 1, step: 10 }}
            />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="描述" />
          </Form.Item>
          {/* 默认创建最多100台 */}
          <Form.Item
            prop="desktopNum"
            label="创建数量"
            required
            hidden={this.getSelectType() !== 'byTemp'}
            rules={[required, lessThanValue(100), isInt]}
          >
            <InputNumber
              placeholder=""
              min={1}
              max={100}
              formatter={value => `${value}`}
              parser={value => value}
            />
          </Form.Item>
          <Form.Item prop="groupId" label="桌面组" hidden>
            <Input placeholder="桌面组" />
          </Form.Item>
          <Diliver />
          <Title slot="网络设置">
            <Reminder
              style={{ marginLeft: -5 }}
              tips="网络设置中最多可添加5个配置集。"
            ></Reminder>
          </Title>
          {this.renderNetWork()}
        </Formx>
      </Drawerx>
    )
  }
}
