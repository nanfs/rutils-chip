import React from 'react'
import { Form, Input, TimePicker, DatePicker } from 'antd'
import { Drawerx, Title, Diliver, Radiox, Selectx, Formx } from '@/components'
import { weekOptions, typeOptions } from '@/utils/formOptions'
import '../index.less'
import accessApi from '@/services/access'
import { required, checkName, number5 } from '@/utils/valid'
import dayjs from 'dayjs'

const { TextArea } = Input
const { RangePicker } = DatePicker
export default class AddDrawer extends React.Component {
  /**
   * @memberof access
   * @param rule 验证规则
   * @param value 传入的值
   * @param 回调函数
   * 验证结束时间不能晚于开始时间
   */
  compareTime = (rule, value, callback) => {
    const startTime = this.drawer?.form.getFieldValue('startTime')
    if (startTime) {
      if (!dayjs(startTime).isBefore(value)) {
        callback(new Error('结束时间必须晚于开始时间'))
      }
    }
    callback()
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  /**
   * @memberof access
   * 设置新建准入策略时的默认值
   */
  pop = () => {
    this.drawer.show()
    this.drawer.form.setFieldsValue({ type: 0, weeks: [] })
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
   * @param values 传入表单值
   * 新建准入策略
   */
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
          startTime: dayjs(values.startTime).format('HH:mm'),
          endTime: dayjs(values.endTime).format('HH:mm')
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
            <Radiox options={typeOptions} onChange={this.onTypeChange} />
          </Form.Item>
          <Form.Item
            required
            prop="weeks"
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
