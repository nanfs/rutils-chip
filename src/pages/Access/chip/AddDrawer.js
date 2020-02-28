import React from 'react'
import { Form, Input, TimePicker, DatePicker, message } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Radiox from '@/components/Radiox'
import Selectx from '@/components/Selectx'
import Title, { Diliver } from '@/components/Title'
import { weekOptions, typeOptions } from '@/utils/formOptions'
import '../index.scss'
import accessApi from '@/services/access'
import { required, checkName, number5 } from '@/utils/valid'
import moment from 'moment'

const { TextArea } = Input
const { RangePicker } = DatePicker
export default class AddDrawer extends React.Component {
  state = {
    checkWeeksRequired: true,
    checkDayRequired: false
  }

  compareTime = (rule, value, callback) => {
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

  componentDidUpdate() {
    const type = this.drawer.form.getFieldValue('type')
    if (type === 1) {
      this.drawer.form.validateFields(['weeks'], this.state.checkWeeksRequired)
    } else {
      this.drawer.form.validateFields(['day'], this.state.checkDayRequired)
    }
  }

  onChange = e => {
    if (e === 1) {
      this.setState({ checkWeeksRequired: true, checkDayRequired: false })
    } else {
      this.setState({ checkWeeksRequired: false, checkDayRequired: true })
    }
    this.forceUpdate()
  }

  pop = () => {
    this.drawer.show()
    this.drawer.form.setFieldsValue({ type: 0 })
    this.setState({
      checkWeeksRequired: true,
      checkDayRequired: false
    })
  }

  add = values => {
    const data = {
      name: values.name,
      description: values.description,
      admitInterval: [
        {
          type: values.type,
          date:
            values.type === 0
              ? values.weeks.join(',')
              : values.day.map(item => item.format('YYYY-MM-DD')).join('<>'),
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
        message.error(errors)
      })
  }

  render() {
    const { checkWeeksRequired, checkDayRequired } = this.state
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
        onOk={this.add}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item
            prop="name"
            required
            label="名称"
            rules={[required, checkName]}
          >
            <Input name="name" placeholder="名称" />
          </Form.Item>
          <Form.Item prop="description" label="描述" rules={[number5]}>
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
            rules={[{ required: checkWeeksRequired, message: '这是必填项' }]}
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
            rules={[{ required: checkDayRequired, message: '这是必填项' }]}
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
            rules={[this.compareTime]}
          >
            <TimePicker format={'HH:mm'} />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
