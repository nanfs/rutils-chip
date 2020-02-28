import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title from '@/components/Title'
import Radiox from '@/components/Radiox'
import {
  memoryOptions,
  cpuOptions,
  manageTypeOptions
} from '@/utils/formOptions'

import poolsApi from '@/services/pools'
import { required, checkName, lessThanValue } from '@/utils/valid'

const { TextArea } = Input

export default class AddDrawer extends React.Component {
  compareNum = (rule, value, callback) => {
    const desktopNum = this.drawer.form.getFieldValue('desktopNum')
    if (desktopNum) {
      if (desktopNum < value) {
        callback(new Error('预启动数量应该不大于创建数量'))
      }
    }
    callback()
  }

  constructor(props) {
    super(props)
    this.state = {
      templateOption: [],
      clusterOptions: []
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = () => {
    this.drawer.show()
    this.drawer.form.setFieldsValue({
      desktopNum: 1,
      prestartNum: 0,
      maxAssignedVmsPerUser: 1
    })
    this.getTemplate()
  }

  // 需要clusetid 还有 id 无奈
  getTemplate = () => {
    this.setState({ templateLoading: true })
    poolsApi
      .getTemplate({ current: 1, size: 10000 })
      .then(res => {
        const templateOptions = res.data.records.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.setState({ templateOptions, templateLoading: false })
      })
      .catch(e => {
        console.log(e)
      })
  }

  addPool = values => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    poolsApi
      .addPool({ cpuNum: 1, ...values })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        console.log(errors)
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
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item
            prop="templateId"
            label="模板"
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox
              getData={this.getTemplate}
              options={this.state.templateOptions}
              loading={this.state.templateLoading}
              onChange={this.onTempalteChange}
            />
          </Form.Item>
          <Form.Item prop="manageType" label="管理类型">
            <Radiox options={manageTypeOptions} />
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
            label="创建数量"
            required
            rules={[required, lessThanValue(20)]}
          >
            <InputNumber placeholder="" min={1} max={20} />
          </Form.Item>

          <Form.Item
            prop="prestartNum"
            label="预启动数量"
            required
            rules={[required, this.compareNum]}
          >
            <InputNumber placeholder="" min={0} max={20} />
          </Form.Item>
          <Form.Item prop="maxAssignedVmsPerUser" label="用户最大虚拟机数">
            <InputNumber placeholder="" />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
