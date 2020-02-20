import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title, { Diliver } from '@/components/Title'
import Radiox from '@/components/Radiox'
import { usbOptions, memoryOptions, cpuOptions } from '@/utils/formOptions'
import desktopsApi from '@/services/desktops'

const { TextArea } = Input

export default class AddDrawer extends React.Component {
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
    // desktopsApi
    //   .getTemplate()
    //   .then(res => {
    //     if (res.success) {
    const networkOption = [
      { label: '网络一', value: '1' },
      { label: '网络二', value: '2' },
      { label: '网络三', value: '3' },
      { label: '网络四', value: '4' }
    ]
    this.setState({ networkOption })
    //   }
    // })
    // .catch(err => console.log(err))
  }

  addVm = values => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    desktopsApi
      .addVm({ data: values })
      .then(res => {
        this.drawer.afterSubmit(res)
        this.props.onSuccess()
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  render() {
    console.log(this.state.networkOption)
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={this.addVm}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="桌面名称">
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item prop="template" label="模板">
            <Radiox getOptionFunction={desktopsApi.getTemplate} />
          </Form.Item>
          <Form.Item prop="usbNum" label="USB数量">
            <Radiox options={usbOptions} />
          </Form.Item>
          <Form.Item
            prop="cpuCore"
            label="CPU"
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox options={cpuOptions} hasInputNumber />
          </Form.Item>
          <Form.Item
            prop="memory"
            label="内存"
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox options={memoryOptions} hasInputNumber />
          </Form.Item>
          <Form.Item prop="desktopNum" label="创建数量">
            <InputNumber placeholder="" />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="" />
          </Form.Item>
          <Diliver />
          <Title slot="网络设置"></Title>
          <Form.Item
            prop="network"
            label="网络"
            wrapperCol={{ sm: { span: 16 } }}
          >
            <Radiox
              // options={this.state.networkOption}
              getOptionFunction={desktopsApi.getTemplate}
            />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
