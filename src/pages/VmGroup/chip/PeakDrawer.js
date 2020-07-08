import React from 'react'
import { Form, Input, Icon, Row, Col, TimePicker, message, Alert } from 'antd'
import { Drawerx, Formx, Title, Reminder } from '@/components'
import vmgroupsApi from '@/services/vmgroups'
import { isInt } from '@/utils/valid'
import dayjs from 'dayjs'

const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)
export default class PeakDrawer extends React.Component {
  //  验证结束时间不能晚于开始时间
  checkEndTime = index => {
    return (rule, value, callback) => {
      const { startTime, endTime } = this.drawer.form.getFieldsValue()
      if (this.state.clean) {
        callback()
      } else {
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
            dayjs(endTime[k]).isAfter(value) &&
            startTime[k] &&
            dayjs(startTime[k]).isBefore(value)
          ) {
            callback(new Error('时间存在重复'))
          }
        })
        callback()
      }
    }
  }

  //  验证开始时间不能晚于开始时间
  checkStartTime = index => {
    return (rule, value, callback) => {
      const { startTime, endTime } = this.drawer.form.getFieldsValue()
      if (this.state.clean) {
        callback()
      } else {
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
            dayjs(startTime[k]).isBefore(value) &&
            endTime[k] &&
            dayjs(endTime[k]).isAfter(value)
          ) {
            callback(new Error('时间存在重复'))
          }
        })
        callback()
      }
    }
  }

  // 验证预启动数量
  checkPreStart = (rule, value, callback) => {
    if (this.state.clean) {
      callback()
    } else {
      if (+value === 0) {
        callback(new Error('不能为0'))
      }
      if (!value && +value !== 0) {
        callback(new Error('这是必填项'))
      }
      if (value && +value > this.state?.desktopNum) {
        callback(new Error('预启动数超过当前桌面组桌面数'))
      }
      callback()
    }
  }

  // 检查其他日期只要值就检查时间
  checkOther = () => {
    const { startTime, endTime } = this.drawer.form.getFieldsValue()
    console.log(startTime, endTime)
    const fields = []

    startTime &&
      startTime.forEach((item, k) => {
        if (item) {
          fields.push(`startTime[${k}]`)
        }
      })
    endTime &&
      endTime.forEach((item, k) => {
        if (item) {
          fields.push(`endTime[${k}]`)
        }
      })
    this.drawer.form.validateFields(fields)
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  componentDidUpdate(props, state) {
    if (JSON.stringify(this.state) !== JSON.stringify(state)) {
      this.setField()
    }
  }

  pop = ({ policies, id: groupId, desktopNum }) => {
    this.drawer.show()
    this.setState({ policies: [{}] }, () =>
      this.setState({
        policies: policies?.length ? policies : [{}],
        groupId,
        desktopNum,
        clean: false
      })
    )
  }

  // 将保存的数据转换为表单的数据
  setField = () => {
    const { policies } = this.state
    const formPolicies = {}
    policies.forEach((item, index) => {
      formPolicies[`startTime[${index}]`] = item.startTime
        ? dayjs(item.startTime, 'HH:mm')
        : null

      formPolicies[`endTime[${index}]`] = item.endTime
        ? dayjs(item.endTime, 'HH:mm')
        : null
      formPolicies[`prestartNumbers[${index}]`] = item.prestartNumbers
    })
    this.drawer.form.setFieldsValue({
      ...formPolicies
    })
  }

  // 获取表单的数据
  getField = () => {
    const formPolicies = this.drawer.form.getFieldsValue()
    const { startTime, endTime, prestartNumbers } = formPolicies
    const policies = []
    startTime.forEach((item, index) => {
      policies.push({
        startTime: startTime[index] ? startTime[index].format('HH:mm') : '',
        endTime: endTime[index] ? endTime[index].format('HH:mm') : '',
        prestartNumbers: prestartNumbers[index] || ''
      })
    })
    return policies
  }

  // 移除设置选项 如果是第一个清空数据
  remove = k => {
    const policies = this.getField()
    if (k === 0 && policies.length === 1) {
      policies[k].startTime = ''
      policies[k].endTime = ''
      policies[k].prestartNumbers = ''
      this.setState({
        policies,
        clean: true
      })
      return
    }
    const newPolicies = [...policies.slice(0, k), ...policies.slice(k + 1)]
    this.setState({
      policies: newPolicies
    })
  }

  // 添加设置选项 最多运行添加10条
  add = index => {
    const policies = this.getField()
    const { endTime, startTime, prestartNumbers } = policies[index]
    if (!endTime || !startTime || !prestartNumbers) {
      return message.error('请先完善当前行再添加!')
    }
    if (index >= 9) {
      return message.error('最多允许添加10条')
    }
    this.setState({
      policies: [...policies, {}],
      clean: false
    })
  }

  // 设置高低峰
  setPeak = () => {
    const { groupId } = this.state
    let policies = this.getField()
    const { endTime, startTime, prestartNumbers } = policies[0]
    if (policies.length === 1 && (!endTime || !startTime || !prestartNumbers)) {
      policies = []
    }
    vmgroupsApi
      .setPolicies({ groupId, policies })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
        console.log(errors)
      })
  }

  // 名单设置是动态表单，新增或删除一条名单时动态渲染输入框组件
  renderPolicies = () => {
    const policies = this.state?.policies
    return (
      policies &&
      policies.map((item, index) => (
        <Row gutter={16} key={index} className="form-item-wrapper">
          <Col span={7}>
            <Form.Item
              prop={`startTime[${index}]`}
              rules={[this.checkStartTime(index)]}
            >
              <TimePicker
                format={'HH:mm'}
                style={{ width: '100%' }}
                onChange={() => console.log('change')}
                onOpenChange={open => !open && this.checkOther()}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              prop={`endTime[${index}]`}
              rules={[this.checkEndTime(index)]}
            >
              <TimePicker
                format={'HH:mm'}
                style={{ width: '100%' }}
                onChange={() => console.log('change')}
                onOpenChange={open => !open && this.checkOther()}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              prop={`prestartNumbers[${index}]`}
              rules={[this.checkPreStart, isInt]}
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
              hidden={index !== policies.length - 1}
              onClick={() => this.add(index)}
              style={{ marginLeft: 8 }}
            />
          </Col>
        </Row>
      ))
    )
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
          {/* <Alert
            message="桌面组预启动配置表示在指定时间内，至少保有虚拟机启动数量。预启动桌面数量一般最大为组内桌面数，预启动规则最多可以配置10组"
            type="info"
            showIcon
          /> */}
          <Title slot="桌面组设置">
            <Reminder
              style={{ marginLeft: -5 }}
              tips="桌面组预启动配置表示在指定时间内，至少保有虚拟机启动数量。预启动桌面数量最大为组内桌面数，预启动规则最多可配置10组。"
            ></Reminder>
          </Title>
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
          {this.renderPolicies()}
        </Formx>
      </Drawerx>
    )
  }
}
