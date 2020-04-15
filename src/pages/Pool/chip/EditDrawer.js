import React from 'react'
import { Form, Input, InputNumber, message } from 'antd'
import { Drawerx, Formx, Title, Radiox } from '@/components'
import { managerTypeOptions } from '@/utils/formOptions'
import poolsApi from '@/services/pools'
import { required, checkName, lessThanValue } from '@/utils/valid'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  compareTotal = (rule, value, callback) => {
    const { oldDeskTopNum } = this.state
    const desktopNum = this.drawer.form.getFieldValue('desktopNum')
    const currentTotal = desktopNum + oldDeskTopNum
    if (value > currentTotal) {
      callback(new Error('应该不大于桌面池总数'))
    }
    callback()
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = poolId => {
    this.setState({ poolId })
    this.drawer.show()
    poolsApi
      .detail(poolId)
      .then(res => {
        const { data } = res
        this.setState({
          templateName: data.templateName,
          oldDeskTopNum: data.desktopNum
        })
        this.drawer.form.setFieldsValue({ ...data, desktopNum: 0 })
      })
      .catch(error => {
        message.error(error.message || error)
        console.log(error)
      })
  }

  editPool = values => {
    const { poolId } = this.state
    poolsApi
      .editPool({ poolId, ...values })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        this.drawer.break(errors)
      })
  }

  render() {
    return (
      <Drawerx
        onRef={ref => {
          this.drawer = ref
        }}
        onSuccess={this.props.onSuccess}
        onClose={this.props.onClose}
        onOk={this.editPool}
      >
        <Formx>
          <Title slot="基础设置"></Title>
          <Form.Item
            prop="name"
            label="桌面池名称"
            required
            rules={[required, checkName]}
          >
            <Input placeholder="桌面池名称" disabled />
          </Form.Item>
          <Form.Item label="模板">{this.state?.templateName}</Form.Item>
          <Form.Item prop="templateId" label="模板id" hidden>
            <Input placeholder="模板" />
          </Form.Item>
          <Form.Item prop="managerType" label="管理类型">
            <Radiox options={managerTypeOptions} disabled />
          </Form.Item>
          <Form.Item
            prop="desktopNum"
            label="增加数量"
            rules={[lessThanValue(20)]}
          >
            <InputNumber placeholder="" min={0} max={20} />
          </Form.Item>
          <Form.Item
            prop="prestartNum"
            label="预启动数量"
            rules={[this.compareTotal]}
          >
            <InputNumber placeholder="" min={0} />
          </Form.Item>
          <Form.Item
            prop="maxAssignedVmsPerUser"
            label="用户最大虚拟机数"
            rules={[this.compareTotal]}
          >
            <InputNumber placeholder="" min={0} />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="描述" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
