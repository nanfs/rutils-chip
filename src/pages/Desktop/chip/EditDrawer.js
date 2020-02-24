import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title, { Diliver } from '@/components/Title'
import Radiox from '@/components/Radiox'
import { usbOptions, memoryOptions, cpuOptions } from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.getTemplate()
    this.getNetwork()
  }

  state = {
    templateOption: [],
    networkOption: []
  }

  getTemplate = () => {
    // axios获取数据
    desktopsApi
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

  getNetwork = () => {
    // axios获取数据
    desktopsApi
      .getTemplate()
      .then(res => {
        if (res.success) {
          const networkOption = [
            { label: '网络一', value: '1' },
            { label: '网络二', value: '2' },
            { label: '网络三', value: '3' },
            { label: '网络四', value: '4' }
          ]
          this.setState({ networkOption })
        }
      })
      .catch(err => console.log(err))
  }

  editVm = values => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    desktopsApi
      .editVm({ data: values })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  render() {
    const { initValues } = this.props
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
        onOk={this.editVm}
      >
        <Formx initValues={initValues}>
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="桌面名称">
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item prop="template" label="模板">
            <Radiox
              options={this.state.templateOption}
              onRefresh={this.getTemplate}
            />
          </Form.Item>
          <Form.Item prop="usbNum" label="USB数量">
            <Radiox options={usbOptions} />
          </Form.Item>
          <Form.Item
            prop="cpuCore"
            label="CPU"
            wrapperCol={{ sm: { span: 12 } }}
          >
            <Radiox options={cpuOptions} />
          </Form.Item>
          <Form.Item
            prop="cpuNum"
            wrapperCol={{ sm: { span: 12 } }}
            className="extend-col"
            style={{ marginTop: '-64px', marginLeft: '65%' }}
          >
            <InputNumber placeholder="" />
          </Form.Item>
          <Form.Item prop="memory" label="内存">
            <Radiox options={memoryOptions} />
          </Form.Item>
          <Form.Item prop="desktopNum" label="创建数量">
            <InputNumber placeholder="" />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="" />
          </Form.Item>
          <Diliver />
          <Title slot="网络设置"></Title>
          <Form.Item prop="network" label="桌面名称">
            <Radiox
              options={this.state.networkOption}
              onRefresh={this.getNetwork}
            />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
