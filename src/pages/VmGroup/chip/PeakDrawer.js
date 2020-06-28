import React from 'react'
import { Form, Input, Icon, Row, Col, TimePicker } from 'antd'
import { Drawerx, Formx, Title } from '@/components'
import vmgroupsApi from '@/services/vmgroups'
import { required } from '@/utils/valid'
import dayjs from 'dayjs'

const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)
export default class PeakDrawer extends React.Component {
  // TODO 添加校验触发函数
  //  验证结束时间不能晚于开始时间
  checkEndTime = index => {
    return (rule, value, callback) => {
      if (!value) {
        callback()
      }
      const startTime = this.drawer.form.getFieldValue(`startTime[${index}]`)
      if (startTime && !dayjs(startTime).isBefore(value)) {
        callback(new Error('结束时间必须晚于开始时间'))
      }
      callback()
    }
  }

  //  验证开始时间不能晚于开始时间
  checkStartTime = index => {
    return (rule, value, callback) => {
      const endTime = this.drawer.form.getFieldValue(`endTime[${index}]`)
      const { peaks } = this.state
      if (!value) {
        callback()
      }
      if (
        peaks.some(
          item =>
            item.startTime &&
            dayjs(item.startTime).isBefore(value) &&
            dayjs(item.endTime).isAfter(value)
        )
      ) {
        callback(new Error('时间存在重合请确认'))
      }
      if (endTime && !dayjs(endTime).isAfter(value)) {
        callback(new Error('开始时间必须晚于结束时间'))
      }
      callback()
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  componentDidUpdate(props, state) {
    if (JSON.stringify(this.state) !== JSON.stringify(state)) {
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

  /**
   * @memberof device
   * 设置表单初始值
   */
  setField = () => {
    const { peaks } = this.state
    const formPeaks = {}
    peaks.forEach((item, index) => {
      console.log('item.startTime :>> ', item.startTime)
      formPeaks[`startTime[${index}]`] = dayjs(item.startTime || '', 'HH:mm')
      formPeaks[`endTime[${index}]`] = dayjs(item.endTime || '', 'HH:mm')
      formPeaks[`preStart[${index}]`] = item.preStart
    })
    this.drawer.form.setFieldsValue({
      ...formPeaks
    })
  }

  /**
   * @memberof device
   * 处理名单数据
   */
  getField = () => {
    const formPeaks = this.drawer.form.getFieldsValue()
    const { startTime, endTime, preStart } = formPeaks
    const peaks = []
    startTime.forEach((item, index) => {
      peaks.push({
        startTime: startTime[index],
        endTime: endTime[index],
        preStart: preStart[index]
      })
    })
    return peaks
  }

  /**
   * @param k 删除数据的序列号
   * 删除名单
   */
  remove = k => {
    const peaks = this.getField()
    if (k === 0 && peaks.length === 1) {
      peaks[k].startTime = ''
      peaks[k].endTime = ''
      peaks[k].preStart = ''
      this.setState({
        peaks
      })
      return false
    }
    const newPeaks = [...peaks.slice(0, k), ...peaks.slice(k + 1)]
    this.setState({
      peaks: newPeaks
    })
  }

  /**
   * @param index 新增名单的序列号
   * 名单最多允许添加10条
   * 名单设置 一条名单必须填完整才允许新增下一条名单
   */
  add = index => {
    const peaks = this.getField()
    // if (index >= 9) {
    //   notification.warn({ message: '最多允许添加10条' })
    //   return
    // }
    this.setState({
      peaks: [...peaks, {}]
    })
  }

  /**
   * 名单设置是动态表单，新增或删除一条名单时动态渲染输入框组件
   */
  renderPeaks = () => {
    const peaks = this.state?.peaks
    return (
      peaks &&
      peaks.map((item, index) => (
        <Row gutter={16} key={index} className="form-item-wrapper">
          <Col span={7}>
            <Form.Item
              prop={`startTime[${index}]`}
              rules={
                index > 0
                  ? [required, this.checkStartTime(index)]
                  : [this.checkStartTime(index)]
              }
            >
              <TimePicker format={'HH:mm'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              prop={`endTime[${index}]`}
              rules={
                index > 0
                  ? [required, this.checkEndTime(index)]
                  : [this.checkEndTime(index)]
              }
              validateTrigger={('onBlur', 'onChange')}
            >
              <TimePicker format={'HH:mm'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              prop={`preStart[${index}]`}
              rules={index > 0 ? [required] : undefined}
            >
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

  /**
   * @param values 表单提交数据
   * 新增外设策略 对提交的数据进行格式处理
   * 名单有一项不为空，提示填完整；全为空，则不提交该数据
   */
  setPeak = () => {
    this.drawer.form
      .validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          console.log(values)
        } else {
          console.log('123', errors, values)
        }
      })
      .catch(() => {
        this.setState({
          submitting: false
        })
      })
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
