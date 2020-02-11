import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title, { Diliver } from '@/components/Title'
import MyRadio from '@/components/MyRadio'
import { usbOptions, memoryOptions, cpuOptions } from '@/utils/formOptions'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  renderTemplate = () => {
    // axios获取数据
    const options = [
      { label: '模板一', value: '1' },
      { label: '模板二', value: '2' },
      { label: '模板三', value: '3' },
      { label: '模板四', value: '4' }
    ]
    return <MyRadio options={options} />
  }

  renderNetWork = () => {
    const options = [
      { label: '网络一', value: '1' },
      { label: '网络二', value: '2' },
      { label: '网络三', value: '3' },
      { label: '网络四', value: '4' }
    ]
    return <MyRadio options={options} />
  }

  render() {
    const { initValues } = this.props
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          console.log(values)
        }}
      >
        <Formx initValues={initValues}>
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" label="桌面名称">
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item prop="template" label="模板">
            {this.renderTemplate()}
          </Form.Item>
          <Form.Item prop="usbNum" label="USB数量">
            <MyRadio options={usbOptions} />
          </Form.Item>
          <Form.Item
            prop="cpuCore"
            label="CPU"
            wrapperCol={{ sm: { span: 12 } }}
          >
            <MyRadio options={cpuOptions} />
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
            <MyRadio options={memoryOptions} />
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
            {this.renderNetWork()}
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
