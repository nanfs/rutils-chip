import React from 'react'
import { Form, Input, InputNumber, Button } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title from '@/components/Title'
import Radiox from '@/components/Radiox'
import Selectx from '@/components/Selectx'
import { manageTypeOptions } from '@/utils/formOptions'
import poolsApi from '@/services/pools'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
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

  pop = id => {
    this.drawer.show()
    poolsApi
      .detail(id)
      .then(res => {
        const { data } = res
        this.setState({ templateName: data.templateName })
        this.drawer.form.setFieldsValue(data)
        this.getNetwork()
      })
      .catch(e => {
        console.log(e)
      })
  }

  editPool = values => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    poolsApi
      .editPool({ data: values })
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
        onSuccess={this.props.onSuccess}
        onClose={this.props.onClose}
        onOk={this.addPool}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="桌面池名称">
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item label="模板">
            <Button>{this.state.templateName}</Button>
          </Form.Item>
          <Form.Item prop="cluster" label="集群">
            <Selectx options={this.state.clusterOptions} />
          </Form.Item>
          <Form.Item prop="manageType" label="管理类型">
            <Radiox options={manageTypeOptions} />
          </Form.Item>
          <Form.Item prop="cpuCores" label="CPU">
            <Button>{this.state.templateName}</Button>
          </Form.Item>
          <Form.Item prop="memory" label="内存">
            <Button>{this.state.templateName}</Button>
          </Form.Item>
          <Form.Item prop="desktopNum" label="创建数量">
            <InputNumber placeholder="" />
          </Form.Item>
          <Form.Item prop="prestartNum" label="预启动数量">
            <InputNumber placeholder="" />
          </Form.Item>
          <Form.Item prop="maxAssignedVmsPerUser" label="用户最多虚拟机数">
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
