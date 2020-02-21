import React from 'react'
import { Form, Input, TimePicker, DatePicker } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Radiox from '@/components/Radiox'
import Selectx from '@/components/Selectx'
import Title, { Diliver } from '@/components/Title'
import { weekOptions, typeOptions } from '@/utils/formOptions'
import '../index.scss'
import accessApi from '@/services/access'
import { required } from '@/utils/valid'
import moment from 'moment'

const { TextArea } = Input
const { RangePicker } = DatePicker
export default class AddDrawer extends React.Component {
  matchingPassword = (rule, value, callback) => {
    const startTime = this.drawer.form.getFieldValue('startTime')
    if (startTime) {
      if (!moment(startTime).isBefore(value)) {
        callback(new Error('结束时间必须晚于开始时间'))
      }
    }
    callback()
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  onChange = () => {
    this.forceUpdate()
  }

  pop = () => {
    this.drawer.show()
  }

  add = values => {
    console.log('add', values)
    const data = {
      name: values.name,
      description: values.description,
      admitInterval: [
        {
          type: values.type,
          date: values.type === 0 ? values.weeks.join(',') : undefined,
          startTime: moment(values.startTime).format('HH:mm'),
          endTime: moment(values.endTime).format('HH:mm')
        }
      ]
    }
    accessApi
      .add(data)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break()
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
        onOk={this.add}
      >
        <Formx initValues={{ type: 0 }}>
          <Title slot="基础设置"></Title>
          <Form.Item prop="name" required label="名称" rules={[required]}>
            <Input name="name" placeholder="名称" />
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
          <Form.Item prop="type" required label="准入方式">
            <Radiox options={typeOptions} onChange={this.onChange} />
          </Form.Item>
          <Form.Item
            required
            prop="weeks"
            label="准入时间"
            className="time-wrap"
            hidden={
              this.drawer &&
              this.drawer.form &&
              this.drawer.form.getFieldValue('type') === 1
            }
          >
            <Selectx options={weekOptions} mode="multiple" />
          </Form.Item>
          <Form.Item
            required
            prop="day"
            label="准入时间"
            className="time-wrap"
            hidden={
              this.drawer &&
              this.drawer.form &&
              this.drawer.form.getFieldValue('type') === 0
            }
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            prop="startTime"
            required
            label="开始时间"
            rules={[required]}
            className="time-wrap"
          >
            <TimePicker format={'HH:mm'} />
          </Form.Item>
          <Form.Item
            prop="endTime"
            required
            label="结束时间"
            className="time-wrap"
            rules={[this.matchingPassword]}
          >
            <TimePicker format={'HH:mm'} />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
