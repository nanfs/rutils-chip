import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title from '@/components/Title'
import Radiox from '@/components/Radiox'
import { usbOptions, manageTypeOptions } from '@/utils/formOptions'
import poolsApi from '@/services/pools'

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
      .addPool({ data: values })
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
          <Form.Item prop="name" label="桌面池名称">
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item prop="templateId" label="模板">
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
          {/* <Form.Item prop="usbNum" label="USB数量">
            <Radiox options={usbOptions} />
          </Form.Item> */}
          <Form.Item prop="desktopNum" label="创建数量">
            <InputNumber placeholder="" />
          </Form.Item>

          <Form.Item
            prop="prestartNum"
            label="预启动数量"
            rules={[this.compareNum]}
          >
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
