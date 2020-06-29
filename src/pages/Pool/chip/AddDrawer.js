import React from 'react'
import { Form, Input, InputNumber, message, Select } from 'antd'
import { Drawerx, Formx, Title, Radiox, Selectx } from '@/components'
import {
  memoryOptions,
  cpuOptions,
  managerTypeOptions
} from '@/utils/formOptions'

import poolsApi from '@/services/pools'
import desktopsApi from '@/services/desktops'
import assetsApi from '@/services/assets'
import { wrapResponse, findArrObj } from '@/utils/tool'
import {
  required,
  checkName,
  lessThanValue,
  isInt,
  moreThanValue
} from '@/utils/valid'

const { TextArea } = Input
const { Option, OptGroup } = Select

export default class AddDrawer extends React.Component {
  checkPoolName = async (rule, value, callback) => {
    const poolList = await poolsApi.list({ size: 100000, current: 1 })
    const names = poolList?.data?.records?.map(item => item.name) || []
    if (names.length && names.includes(value)) {
      callback(new Error('已经存在该名称'))
    }
    callback()
  }

  compareNum = (rule, value, callback) => {
    const desktopNum = this.drawer.form.getFieldValue('desktopNum')
    if (desktopNum) {
      if (desktopNum < value) {
        callback(new Error('应该不大于桌面池总数'))
      }
    }
    callback()
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  /**
   *
   *
   * @memberof AddDrawer
   */
  pop = () => {
    this.drawer.show()
    this.drawer.form.setFieldsValue({
      desktopNum: 1,
      prestartNum: 0,
      maxAssignedVmsPerUser: 1
    })
    this.getCluster()
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
      isoName: undefined
    })
    this.setState({ clusterId, storagePoolId, cpuName }, () => {
      this.getTemplate()
      cpuName === 'SW1621' && this.getIso()
    })
  }

  // 取模板列表 状态可用
  getTemplate = () => {
    return desktopsApi
      .getTemplate({
        current: 1,
        size: 10000,
        clusterId: this.state?.clusterId,
        statusIsOk: 1
      })
      .then(res => {
        const templateOptions = res.data.records.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.setState({ templateOptions, templateData: res.data.records })
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  /**
   *
   * 获取ISO列表 判断 加入到对应列表
   * SW适配
   * @memberof AddDrawer
   */
  getIso = () => {
    const { storagePoolId } = this.state
    if (!storagePoolId) {
      return message.error('请先选择集群')
    }
    return desktopsApi.getIso({ storagePoolId }).then(res =>
      wrapResponse(res)
        .then(() => {
          const swISO = []
          res.data.forEach(item => {
            const name = item.repoImageId.toLowerCase()
            if (name.includes('sw_64') && !name.includes('.live.img')) {
              return swISO.push(item.repoImageId)
            }
          })
          this.setState({ isos: { swISO } })
        })
        .catch(error => {
          message.error(error.message || error)
        })
    )
  }

  // 添加桌面池
  addPool = values => {
    poolsApi
      .addPool({ cpuNum: 1, ...values })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(error => {
        this.drawer.break(error)
      })
  }

  // SW适配
  renderOsOptions = () => {
    return (
      <Selectx
        style={{ width: '90%' }}
        placeholder="请选择镜像"
        onChange={this.onIsoChange}
        getData={this.getIso}
      >
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

  render() {
    const formItemLayout = {
      labelCol: {
        sm: { span: 5, pull: 1 }
      },
      wrapperCol: {
        sm: { span: 16 }
      }
    }
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={this.addPool}
        onSuccess={this.props.onSuccess}
        onClose={this.props.onClose}
      >
        <Formx formItemLayout={formItemLayout}>
          <Title slot="基础设置"></Title>
          <Form.Item
            prop="name"
            label="桌面池名称"
            required
            validateTrigger={'onBlur'}
            rules={[required, checkName, this.checkPoolName]}
          >
            <Input placeholder="桌面池名称" />
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
            prop="templateId"
            label="模板"
            rules={[required]}
            hidden={!this.state?.clusterId}
            required
          >
            <Radiox
              showExpand
              getData={this.getTemplate}
              options={this.state?.templateOptions}
            />
          </Form.Item>
          {/* SW适配 */}
          <Form.Item
            prop="isoName"
            label={'附加CD'}
            required
            rules={this.state?.cpuName === 'SW1621' ? [required] : undefined}
            hidden={this.state?.cpuName !== 'SW1621'}
          >
            {this.renderOsOptions()}
          </Form.Item>
          <Form.Item prop="managerType" required label="管理类型">
            <Radiox options={managerTypeOptions} />
          </Form.Item>
          <Form.Item
            prop="cpuCores"
            label="CPU"
            required
            rules={[required, lessThanValue(160), isInt]}
          >
            <Radiox
              options={cpuOptions}
              hasInputNumber
              numProps={{ min: 1, max: 160 }}
            />
          </Form.Item>
          <Form.Item
            prop="memory"
            label="内存"
            required
            rules={[required, isInt]}
          >
            <Radiox
              options={memoryOptions}
              hasInputNumber
              numProps={{ min: 1, max: 100 }}
            />
          </Form.Item>
          <Form.Item
            prop="desktopNum"
            label="桌面数量"
            required
            rules={[required, lessThanValue(20), isInt]}
          >
            <InputNumber
              placeholder=""
              min={1}
              max={20}
              formatter={value => `${value}`}
              parser={value => value}
            />
          </Form.Item>

          <Form.Item
            prop="prestartNum"
            label="预启动数量"
            required
            rules={[required, this.compareNum, isInt]}
          >
            <InputNumber
              placeholder=""
              min={0}
              formatter={value => `${value}`}
              parser={value => value}
            />
          </Form.Item>
          <Form.Item
            prop="maxAssignedVmsPerUser"
            label="用户最大虚拟机数"
            required
            rules={[required, this.compareNum, isInt, moreThanValue(0)]}
          >
            <InputNumber
              placeholder=""
              min={1}
              formatter={value => `${value}`}
              parser={value => value}
            />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="描述" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
