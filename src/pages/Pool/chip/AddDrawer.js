import React from 'react'
import { Form, Input, InputNumber, message } from 'antd'
import { Drawerx, Formx, Title, Radiox } from '@/components'
import {
  memoryOptions,
  cpuOptions,
  managerTypeOptions
} from '@/utils/formOptions'

import poolsApi from '@/services/pools'
import { required, checkName, lessThanValue, isInt } from '@/utils/valid'

const { TextArea } = Input

export default class AddDrawer extends React.Component {
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
    this.getTemplate()
  }

  /**
   * 取模板列表 状态可用
   *
   * @memberof AddDrawer
   */
  getTemplate = () => {
    return poolsApi
      .getTemplate({ current: 1, size: 10000, statusIsOk: 1 })
      .then(res => {
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

  /**
   *
   *  添加桌面池
   * @memberof AddDrawer
   */
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

  render() {
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={this.addPool}
        onSuccess={this.props.onSuccess}
        onClose={this.props.onClose}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item
            prop="name"
            label="桌面池名称"
            required
            rules={[required, checkName]}
          >
            <Input placeholder="桌面池名称" />
          </Form.Item>
          <Form.Item
            prop="templateId"
            label="模板"
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox
              getData={this.getTemplate}
              options={this.state?.templateOptions}
            />
          </Form.Item>
          <Form.Item prop="managerType" label="管理类型">
            <Radiox options={managerTypeOptions} />
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
              numProps={{ min: 1, max: 160 }}
            />
          </Form.Item>
          <Form.Item
            prop="memory"
            label="内存"
            required
            rules={[required]}
            wrapperCol={{ sm: { span: 16 } }}
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
            <InputNumber placeholder="" min={1} max={20} />
          </Form.Item>

          <Form.Item
            prop="prestartNum"
            label="预启动数量"
            required
            rules={[required, this.compareNum, isInt]}
          >
            <InputNumber placeholder="" min={0} />
          </Form.Item>
          <Form.Item
            prop="maxAssignedVmsPerUser"
            label="用户最大虚拟机数"
            rules={[this.compareNum, isInt]}
          >
            <InputNumber placeholder="" min={0} />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="描述" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
