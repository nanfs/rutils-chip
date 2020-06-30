import React from 'react'
import { Form, Input, Icon, Row, Col, TimePicker, message } from 'antd'
import { Drawerx, Formx, Title } from '@/components'
import vmgroupsApi from '@/services/vmgroups'
import dayjs from 'dayjs'

const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)
export default class PeakDrawer extends React.Component {
  //  验证结束时间不能晚于开始时间
  checkEndTime = index => {
    return (rule, value, callback) => {
      const { startTime, endTime } = this.drawer.form.getFieldsValue()
      if (!value) {
        callback(new Error('这是必填项'))
      }
      endTime.forEach((item, k) => {
        if (
          k === index &&
          startTime[index] &&
          !dayjs(startTime[index]).isBefore(value)
        ) {
          callback(new Error('结束时间必须晚于开始时间'))
        }
        if (
          k !== index &&
          endTime[k] &&
          endTime[k].isAfter(value) &&
          startTime[k] &&
          dayjs(startTime[k]).isBefore(value)
        ) {
          callback(new Error('时间存在重复'))
        }
      })
      callback()
    }
  }

  //  验证开始时间不能晚于开始时间
  checkStartTime = index => {
    return (rule, value, callback) => {
      const { startTime, endTime } = this.drawer.form.getFieldsValue()
      if (!value) {
        callback(new Error('这是必填项'))
      }
      startTime.forEach((item, k) => {
        if (
          k === index &&
          endTime[index] &&
          !dayjs(endTime[index]).isAfter(value)
        ) {
          callback(new Error('开始时间必须早于结束时间'))
        }
        if (
          k !== index &&
          startTime[k] &&
          startTime[k].isBefore(value) &&
          endTime[k] &&
          dayjs(endTime[k]).isAfter(value)
        ) {
          callback(new Error('时间存在重复'))
        }
      })
      callback()
    }
  }

  // 验证预启动数量
  checkPreStart = (rule, value, callback) => {
    if (!value) {
      callback(new Error('这是必填项'))
    }
    if (value && +value > this.state?.desktopNum) {
      callback(new Error('预启动数超过当前桌面组桌面数'))
    }
    callback()
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  componentDidUpdate(props, state) {
    if (JSON.stringify(this.state) !== JSON.stringify(state)) {
      console.log('123123')
      this.setField()
    }
  }

  pop = data => {
    this.drawer.show()
    const { peaks = [], groupId, desktopNum } = data
    this.setState({
      peaks,
      groupId,
      desktopNum
    })
  }

  // 将保存的数据转换为表单的数据
  setField = () => {
    const { peaks } = this.state
    const formPeaks = {}
    peaks.forEach((item, index) => {
      formPeaks[`startTime[${index}]`] = item.startTime
        ? dayjs(item.startTime, 'HH:mm')
        : null

      formPeaks[`endTime[${index}]`] = item.endTime
        ? dayjs(item.endTime, 'HH:mm')
        : null
      formPeaks[`preStart[${index}]`] = item.preStart
    })
    this.drawer.form.setFieldsValue({
      ...formPeaks
    })
  }

  // 获取表单的数据
  getField = () => {
    const formPeaks = this.drawer.form.getFieldsValue()
    const { startTime, endTime, preStart } = formPeaks
    const peaks = []
    startTime.forEach((item, index) => {
      peaks.push({
        startTime: startTime[index] ? startTime[index].format('HH:mm') : '',
        endTime: endTime[index] ? endTime[index].format('HH:mm') : '',
        preStart: preStart[index] || ''
      })
    })
    console.log('peaks', peaks)
    return peaks
  }

  // 移除设置选项 如果是第一个清空数据
  remove = k => {
    const peaks = this.getField()
    if (k === 0 && peaks.length === 1) {
      peaks[k].startTime = ''
      peaks[k].endTime = ''
      peaks[k].preStart = ''
      this.setState({
        peaks
      })
      return
    }
    const newPeaks = [...peaks.slice(0, k), ...peaks.slice(k + 1)]
    this.setState({
      peaks: newPeaks
    })
  }

  // 添加设置选项 最多运行添加10条
  add = index => {
    const peaks = this.getField()
    if (index >= 9) {
      message.error('最多允许添加10条')
      return
    }
    this.setState({
      peaks: [...peaks, {}]
    })
  }

  // 名单设置是动态表单，新增或删除一条名单时动态渲染输入框组件
  renderPeaks = () => {
    const peaks = this.state?.peaks
    return (
      peaks &&
      peaks.map((item, index) => (
        <Row gutter={16} key={index} className="form-item-wrapper">
          <Col span={7}>
            <Form.Item
              prop={`startTime[${index}]`}
              rules={[this.checkStartTime(index)]}
            >
              <TimePicker format={'HH:mm'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              prop={`endTime[${index}]`}
              rules={[this.checkEndTime(index)]}
            >
              <TimePicker format={'HH:mm'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item prop={`preStart[${index}]`} rules={[this.checkPreStart]}>
              <Input placeholder="预启动桌面数" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(index)}
            />
            <Icon
              className="dynamic-delete-button"
              type="plus-circle"
              hidden={index !== peaks.length - 1}
              onClick={() => this.add(index)}
              style={{ marginLeft: 8 }}
            />
          </Col>
        </Row>
      ))
    )
  }

  // 设置高低峰
  setPeak = () => {
    console.log(this.drawer.form.getFieldsValue())
    const { groupId } = this.state
    const peaks = this.getField()
    vmgroupsApi
      .setPeaks({ groupId, peaks })
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
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
        onOk={this.setPeak}
      >
        <Formx>
          <Title slot="桌面组设置"></Title>
          <Row gutter={16} className="form-item-wrapper">
            <Col span={7}>
              <Form.Item label="开始时间"></Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="结束时间"></Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="预启动桌面数"></Form.Item>
            </Col>
          </Row>
          {this.renderPeaks()}
        </Formx>
      </Drawerx>
    )
  }
}
