import React from 'react'
import { Form, Input, TimePicker, DatePicker } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Radiox from '@/components/Radiox'
import Selectx from '@/components/Selectx'
import Title, { Diliver } from '@/components/Title'
import '../index.scss'

const { TextArea } = Input

class AddDrawer extends React.Component {
  state = {
    type: 'week'
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  onChange = e => {
    console.log(e)
    this.setState({ type: e })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const radioOptions = [
      { label: '按周', value: 'week' },
      { label: '按天', value: 'day' }
      // { label: '按月', value: 'month' },
      // { label: '按年', value: 'year' }
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
          console.log(getFieldValue('date'), getFieldValue('weeks'))
        }}
      >
        <Formx>
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
          <Form.Item prop="type" required label="准入方式">
            <Radiox
              options={radioOptions}
              onChange={this.onChange}
              defaultVal="week"
            />
          </Form.Item>
          <Form.Item required label="准入时间" className="time-wrap">
            {
              {
                day: getFieldDecorator('weeks')(
                  <Selectx options={weekOptions} mode="multiple" />
                ),
                week: getFieldDecorator('date')(<DatePicker />)
              }[this.state.type]
            }
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

const WrappedAddDrawer = Form.create()(AddDrawer)

export default WrappedAddDrawer
