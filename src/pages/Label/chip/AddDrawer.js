import React from 'react'
import { Form, Input, TimePicker, Tag, message } from 'antd'
import {
  Drawerx,
  Formx,
  Title,
  Radiox,
  Selectx,
  Tablex,
  SelectSearch
} from '@/components'
import taskApi from '@/services/task'
import { required, checkName, textRange } from '@/utils/valid'
import { week2num } from '@/utils/tool'
import {
  taskTypeOptions,
  typeOptions2,
  weekEnOptions
} from '@/utils/formOptions'
import produce from 'immer'
import '../index.less'
import dayjs from 'dayjs'

const { TableWrap, ToolBar, BarLeft } = Tablex
const { TextArea } = Input

export default class AddDrawer extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  /**
   * @memberof AddDrawer
   * @description 打开任务创建抽屉
   */
  pop = () => {
    this.drawer.show()
  }

  onTypeChange = () => {
    this.forceUpdate()
  }

  /**
   * @memberof Task
   * 执行方式改变时获取对应的值
   */
  getSelectType = () => {
    return this.drawer?.form?.getFieldValue('way')
  }

  /**
   * @memberof Task
   * @description 提交新建计划任务
   */
  addTask = values => {
    const { name, taskType, way, weeks, time, description } = values
    const { totalSelection } = this.state
    let cron = ''
    const timeStrArr = dayjs(time)
      .format('HH:mm')
      .split(':')
    const weeksStr = weeks
      ? weeks
          .sort((a, b) => {
            return week2num(a) - week2num(b)
          })
          .join(',')
      : ''
    if (way === 0) {
      cron = `0 ${timeStrArr[1]} ${timeStrArr[0]} ? * ${weeksStr}`
    } else {
      cron = `0 ${timeStrArr[1]} ${timeStrArr[0]} * * ?`
    }
    const taskObjects = totalSelection.map(item => {
      const [objectIds] = item.split('&')
      return { objectId: objectIds, objectType: 0 }
    })
    const data = {
      name,
      taskType,
      cron,
      taskObjects,
      description
    }
    taskApi
      .addTask(data)
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
        console.log(errors)
      })
  }

  render() {
    const searchOptions = [{ label: '桌面名称', value: 'name' }]
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onOk={values => {
          this.addTask(values)
          return false
        }}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item
            prop="name"
            label="任务名称"
            required
            rules={[required, checkName, textRange(0, 63)]}
          >
            <Input placeholder="任务名称" />
          </Form.Item>
          <Form.Item
            prop="taskType"
            label="任务类型"
            required
            rules={[required]}
          >
            <Radiox options={taskTypeOptions} />
          </Form.Item>
          <Form.Item prop="way" required label="执行方式" rules={[required]}>
            <Radiox options={typeOptions2} onChange={this.onTypeChange} />
          </Form.Item>
          <Form.Item
            required
            prop="weeks"
            label="执行周期"
            className="time-wrap"
            rules={this.getSelectType() === 0 ? [required] : undefined}
            hidden={this.getSelectType() === 1}
          >
            <Selectx options={weekEnOptions} mode="multiple" />
          </Form.Item>
          <Form.Item
            required
            prop="time"
            label="执行时间"
            className="time-wrap"
            rules={[required]}
          >
            <TimePicker format={'HH:mm'} />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="描述" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}