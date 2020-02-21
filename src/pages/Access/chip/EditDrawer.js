import React from 'react'
import { Form, Input, TimePicker, DatePicker } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Radiox from '@/components/Radiox'
import Selectx from '@/components/Selectx'
import Title, { Diliver } from '@/components/Title'
import { weekOptions, typeOptions } from '@/utils/formOptions'
import '../index.scss'
import moment from 'moment'
import accessApi from '@/services/access'

const { TextArea } = Input
const { RangePicker } = DatePicker

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = data => {
    this.drawer.show()
    const { id, name, description, admitInterval } = data
    const {
      date,
      type,
      startTime: startTimeStr,
      endTime: endTimeStr
    } = admitInterval[0]
    const week = type === 0 ? date.split(',') : undefined
    const day =
      type === 1
        ? date.split('<>').map(item => moment(item, 'YYYY/MM/DD'))
        : undefined
    const startTime = moment(startTimeStr, 'HH:mm')
    const endTime = moment(endTimeStr, 'HH:mm')
    this.drawer.form.setFieldsValue({
      id,
      name,
      description,
      week,
      day,
      type,
      startTime,
      endTime
    })
  }

  onChange = () => {
    this.forceUpdate()
  }

  edit = values => {
    const {
      id,
      name,
      type,
      description,
      week,
      day,
      startTime,
      endTime
    } = values
    const data = {
      id,
      name,
      description,
      admitInterval: [
        {
          type,
          date:
            type === 0
              ? week.join(',')
              : day.map(item => item.format('YYYY-MM-DD')).join('<>'),
          startTime: moment(startTime).format('HH:mm'),
          endTime: moment(endTime).format('HH:mm')
        }
      ]
    }
    accessApi
      .update(data)
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
        onOk={this.edit}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="name" required label="名称">
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
          <Form.Item required prop="type" label="准入方式">
            <Radiox options={typeOptions} onChange={this.onChange} />
          </Form.Item>
          <Form.Item
            required
            prop="week"
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
