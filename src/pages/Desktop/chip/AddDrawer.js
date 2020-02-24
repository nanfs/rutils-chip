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
  }

  state = {
    networkOption: [
      { label: '网络一', value: '1' },
      { label: '网络二', value: '2' },
      { label: '网络三', value: '3' },
      { label: '网络四', value: '4' }
    ]
  }

  pop = () => {
    this.drawer.show()
    this.setState({ fetchData: true })
  }

  addVm = values => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    desktopsApi
      .addVm({ values })
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
        onOk={this.addVm}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="桌面名称">
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item
            prop="template"
            label="模板"
            hidden={!this.state.fetchData}
          >
            <Radiox
              getOptionFunction={desktopsApi.getTemplate}
              param={{ current: 1, size: 10000 }}
            />
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
              options={this.state.networkOption}
              getOptionFunction={desktopsApi.getTemplate}
              fetch={this.state.fetchData}
            />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
