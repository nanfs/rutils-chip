import React from 'react'
import { Form, Input, TimePicker, DatePicker } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Radiox from '@/components/Radiox'
import Selectx from '@/components/Selectx'
import Title, { Diliver } from '@/components/Title'
import '../index.scss'
import moment from 'moment'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  state = {
    current: 0
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.setState({
      current: this.drawer.form.getFieldValue('type')
    })
  }

  onChange = (value, values, e) => {
    const type = e.target.value
    console.log('onchange', type)
    this.setState({ current: type })
  }

  render() {
    const { initValues } = this.props
    const radioOptions = [
      { label: '按周', value: 0 },
      { label: '按天', value: 1 }
    ]
    const weekOptions = [
      { label: '周一', value: '1' },
      { label: '周二', value: '2' },
      { label: '周三', value: '3' },
      { label: '周四', value: '4' },
      { label: '周五', value: '5' },
      { label: '周六', value: '6' },
      { label: '周日', value: '7' }
    ]
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
          <Form.Item prop="name" required label="终端名称">
            <Input name="name" placeholder="终端名称" />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea
              style={{ resize: 'none' }}
              rows={4}
              name="description"
              placeholder="描述"
            />
          </Form.Item>
          <Diliver />
          <Title slot="准入设置"></Title>
          <Form.Item required prop="type" label="准入方式">
            <Radiox options={radioOptions} onChange={this.onChange} />
          </Form.Item>
          <Form.Item
            required
            // prop="date"
            label="准入时间"
            className="time-wrap"
          >
            {this.state.current === 0 && (
              <Selectx options={weekOptions} mode="multiple" />
            )}
            {this.state.current === 1 && <DatePicker />}
          </Form.Item>
          <Form.Item
            prop="startTime"
            required
            label="开始时间"
            className="time-wrap"
          >
            <TimePicker format={'HH:mm'} />
          </Form.Item>
          <Form.Item
            prop="endTime"
            required
            label="结束时间"
            className="time-wrap"
          >
            <TimePicker format={'HH:mm'} />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
