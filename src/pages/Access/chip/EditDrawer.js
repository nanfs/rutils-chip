import React from 'react'
import { Form, Input, TimePicker, DatePicker } from 'antd'
import { Drawerx, Formx, Radiox, Selectx, Title, Diliver } from '@/components'
import { weekOptions, typeOptions } from '@/utils/formOptions'
import '../index.less'
import dayjs from 'dayjs'
import accessApi from '@/services/access'
import { required, checkName, number5 } from '@/utils/valid'

const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)
const { TextArea } = Input
const { RangePicker } = DatePicker

export default class EditDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  /**
   * @memberof access
   * @param data 编辑准入策略时的初始值
   */
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
        ? date.split('<>').map(item => dayjs(item, 'YYYY/MM/DD'))
        : undefined
    const startTime = dayjs(startTimeStr, 'HH:mm')
    const endTime = dayjs(endTimeStr, 'HH:mm')
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

  /**
   * @memberof access
   * 准入方式改变时获取对应的值
   */
  getSelectType = () => {
    return this.drawer?.form?.getFieldValue('type')
  }

  onTypeChange = () => {
    this.forceUpdate()
  }

  /**
   * @memberof access
   * @param rule 验证规则
   * @param value 传入的值
   * @param 回调函数
   * 验证结束时间不能晚于开始时间
   */
  compareTime = (rule, value, callback) => {
    const startTime = this.drawer.form.getFieldValue('startTime')
    if (startTime) {
      if (!dayjs(startTime).isBefore(value)) {
        callback(new Error('结束时间必须晚于开始时间'))
      }
    }
    callback()
  }

  /**
   * @memberof access
   * @param values 传入表单值
   * 编辑准入策略
   */
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
              ? week
                  .sort(function(a, b) {
                    return a - b
                  })
                  .join(',')
              : day.map(item => item.format('YYYY-MM-DD')).join('<>'),
          startTime: dayjs(startTime).format('HH:mm'),
          endTime: dayjs(endTime).format('HH:mm')
        }
      ]
    }
    accessApi
      .update(data)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
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
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item prop="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            prop="name"
            required
            label="名称"
            rules={[required, checkName]}
          >
            <Input name="name" placeholder="名称" />
          </Form.Item>
          <Form.Item prop="description" label="描述" rules={[number5]}>
            <TextArea style={{ resize: 'none' }} rows={4} placeholder="描述" />
          </Form.Item>
          <Diliver />
          <Title slot="准入设置"></Title>
          <Form.Item required prop="type" label="准入方式">
            <Radiox options={typeOptions} onChange={this.onTypeChange} />
          </Form.Item>
          <Form.Item
            required
            prop="week"
            label="准入时间"
            className="time-wrap"
            rules={this.getSelectType() === 0 ? [required] : undefined}
            hidden={this.getSelectType() === 1}
          >
            <Selectx options={weekOptions} mode="multiple" />
          </Form.Item>
          <Form.Item
            required
            prop="day"
            label="准入时间"
            className="time-wrap"
            rules={this.getSelectType() === 1 ? [required] : undefined}
            hidden={this.getSelectType() === 0}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            prop="startTime"
            required
            label="开始时间"
            className="time-wrap"
          >
            <TimePicker
              format={'HH:mm'}
              onChange={(a, b, c) => {
                console.log(a, b, c)
              }}
            />
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
