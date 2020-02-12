import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title from '@/components/Title'
import Radiox from '@/components/Radiox'
import Selectx from '@/components/Selectx'
import { usbOptions, manageTypeOptions } from '@/utils/formOptions'
import poolsApi from '@/services/pools'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.getTemplate()
    this.getCluster()
  }

  state = {
    templateOption: [],
    clusterOptions: []
  }

  getTemplate = () => {
    // axios获取数据
    poolsApi
      .getTemplate()
      .then(res => {
        if (res.success) {
          const templateOption = [
            { label: '模板一', value: '1' },
            { label: '模板二', value: '2' },
            { label: '模板三', value: '3' },
            { label: '模板四', value: '4' }
          ]
          this.setState({ templateOption })
        }
      })
      .catch(err => console.log(err))
  }

  getCluster = () => {
    // axios获取数据
    poolsApi
      .getCluster()
      .then(res => {
        if (res.success) {
          const clusterOptions = [
            { label: '集群一', value: '1' },
            { label: '集群二', value: '2' },
            { label: '集群三', value: '3' },
            { label: '集群四', value: '4' }
          ]
          this.setState({ clusterOptions })
        }
      })
      .catch(err => console.log(err))
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
        onOk={this.addPool}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="桌面池名称">
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item prop="template" label="模板">
            <Radiox
              options={this.state.templateOption}
              onRefresh={this.getTemplate}
            />
          </Form.Item>
          <Form.Item prop="cluster" label="集群">
            <Selectx options={this.state.clusterOptions} />
          </Form.Item>
          <Form.Item prop="manageType" label="管理类型">
            <Radiox options={manageTypeOptions} />
          </Form.Item>
          <Form.Item prop="usbNum" label="USB数量">
            <Radiox options={usbOptions} />
          </Form.Item>
          <Form.Item prop="desktopNum" label="创建数量">
            <InputNumber placeholder="" />
          </Form.Item>
          <Form.Item prop="prestartNum" label="预启动数量">
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
