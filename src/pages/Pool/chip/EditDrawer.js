import React from 'react'
import { Form, Input, InputNumber, Button } from 'antd'
import Drawerx from '@/components/Drawerx'
import Formx from '@/components/Formx'
import Title from '@/components/Title'
import Radiox from '@/components/Radiox'
import { manageTypeOptions } from '@/utils/formOptions'
import poolsApi from '@/services/pools'
import { required, checkName, lessThanValue } from '@/utils/valid'

const { TextArea } = Input

export default class EditDrawer extends React.Component {
  state = {
    templateOption: [],
    clusterOptions: []
  }

  less20 = (rule, value, callback) => {
    const desktopNum = this.drawer.form.getFieldValue('desktopNum')
    if (desktopNum + value > 20) {
      callback(new Error('池最多包含20台虚拟机'))
    }
    callback()
  }

  compareTotal = (rule, value, callback) => {
    const desktopNum = this.drawer.form.getFieldValue('desktopNum')
    const editDesktopNum = this.drawer.form.getFieldValue('editDesktopNum')
    const currentTotal = desktopNum + editDesktopNum
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
        this.setState({ templateName: data.templateName })
        this.drawer.form.setFieldsValue(data)
        this.getNetwork()
      })
      .catch(e => {
        console.log(e)
      })
  }

  editPool = values => {
    // TODO 是否是新增 删除 还是直接 传入桌面是单个还是批量
    const { poolId } = this.state
    poolsApi
      .editPool({ poolId, values })
      .then(res => {
        this.drawer.afterSubmit(res)
      })
      .catch(errors => {
        console.log(errors)
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
            rules={[required, checkName]}
          >
            <Input placeholder="桌面名称" />
          </Form.Item>
          <Form.Item label="模板">
            <Button>{this.state.templateName}</Button>
          </Form.Item>
          <Form.Item prop="templateId" label="模板id" hidden>
            <Input placeholder="模板" />
          </Form.Item>
          <Form.Item prop="manageType" label="管理类型">
            <Radiox options={manageTypeOptions} />
          </Form.Item>
          <Form.Item prop="desktopNum" hidden>
            <InputNumber placeholder="" />
          </Form.Item>
          <Form.Item
            prop="editDesktopNum"
            label="增加数量"
            rules={[this.less20]}
          >
            <InputNumber placeholder="" min={0} max={20} />
          </Form.Item>
          <Form.Item
            prop="prestartNum"
            label="预启动数量"
            rules={[this.compareTotal]}
          >
            <InputNumber placeholder="" min={1} max={20} />
          </Form.Item>
          <Form.Item
            prop="maxAssignedVmsPerUser"
            label="用户最大虚拟机数"
            rules={[this.compareTotal]}
          >
            <InputNumber placeholder="" />
          </Form.Item>
          <Form.Item prop="description" label="描述">
            <TextArea placeholder="" />
          </Form.Item>
        </Formx>
      </Drawerx>
    )
  }
}
