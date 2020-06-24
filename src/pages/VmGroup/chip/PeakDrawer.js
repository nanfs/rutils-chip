import React from 'react'
import { Form, Input, Icon, Row, Col, notification } from 'antd'
import { Drawerx, Formx, Title } from '@/components'
import vmgroupsApi from '@/services/vmgroups'
import { required, checkName } from '@/utils/valid'

export default class PeakDrawer extends React.Component {
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
      formPeaks[`startTime[${index}]`] = item.startTime
      formPeaks[`endTime[${index}]`] = item.endTime
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
      peaks: [...peaks, []]
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
              rules={index > 0 ? [required] : undefined}
            >
              <Input placeholder="开始时间" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              prop={`endTime[${index}]`}
              rules={index > 0 ? [required] : undefined}
            >
              <Input placeholder="开始时间" />
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
  addDev = values => {
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
        <Formx
          onRef={ref => {
            this.formx = ref
          }}
        >
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
