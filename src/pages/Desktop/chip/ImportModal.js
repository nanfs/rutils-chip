import React from 'react'
import { Formx, Modalx, Selectx } from '@/components'
import { Form, Checkbox, Input, Divider, Button, Table, Steps } from 'antd'
import templateApi from '@/services/template'
import EditTable from './editTable'
import { required } from '@/utils/valid'

const { Step } = Steps

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5, pull: 1 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}

const { createModalCfg } = Modalx
export default class ImportModal extends React.Component {
  state = {
    dataCenterOptions: [{ label: 'asd', value: 'aaa' }],
    sourceOptions: [{ label: 'asd', value: 'aaa' }],
    jiqunOptions: [{ label: 'asd', value: 'aaa' }],
    vmList: [{ name: 'ddd' }],
    selectedVmList: [{ name: 'ddd', storage: 'wwe', cpu: 'sss' }],
    current: 0,
    disabledButton: true,
    formData: {}
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = vmId => {
    this.modal.show()
    // this.modal.form.setFieldsValue({ vmId })
  }

  // 加载源中虚拟机
  fetchVmList = () => {}

  onSelectChange = (selectKeys, selectData) => {
    this.setState({
      selection: selectKeys,
      selectData
    })
    if (this.state.formData.dataCenter && this.state.formData.source) {
      this.setState({ disabledButton: false })
    }
  }

  dataCenterChange = (a, b, data) => {
    this.setState({
      formData: {
        ...this.state.formData,
        dataCenter: data
      }
    })
    if (this.state.formData.source && this.state.selectData?.length) {
      this.setState({ disabledButton: false })
    }
  }

  sourceChange = (a, b, data) => {
    this.setState({
      formData: {
        ...this.state.formData,
        source: data
      }
    })
    if (this.state.formData.dataCenter && this.state.selectData?.length) {
      this.setState({ disabledButton: false })
    }
  }

  onOk = () => {
    console.log(this.forma.getFieldsValue())
    console.log(this.state.selectedVmList)
    // templateApi
    //   .addTem(values)
    //   .then(res => {
    //     this.modal.afterSubmit(res)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     this.modal.break(error)
    //   })
  }

  next() {
    this.setState({ current: this.state.current + 1 })
  }

  prev() {
    const { formData } = this.state
    this.setState({ current: this.state.current - 1 }, () =>
      this.formb.setFieldsValue({ ...formData })
    )
  }

  getTableData(data) {
    this.setState({ selectedVmList: data })
  }

  stepRender() {
    const { current, selection } = this.state
    const rowSelection = {
      selectedRowKeys: selection,
      onChange: this.onSelectChange,
      getCheckboxProps: () => ({
        disabled: this.props.disabled
      })
    }
    const vmColums = [
      {
        title: '名称',
        ellipsis: true,
        dataIndex: 'name'
      }
    ]
    const steps = [
      {
        index: '1',
        content: (
          <Formx
            ref={node => {
              this.formb = node
            }}
          >
            <Form.Item
              prop="dataCenter"
              label="数据中心"
              required
              rules={[required]}
            >
              <Selectx
                placeholder="请选择数据中心"
                options={this.state?.dataCenterOptions}
                onChange={this.dataCenterChange}
              ></Selectx>
            </Form.Item>
            <Form.Item prop="source" label="源" required rules={[required]}>
              <Selectx
                placeholder="请选择源"
                options={this.state?.sourceOptions}
                onChange={this.sourceChange}
              ></Selectx>
            </Form.Item>
            <Divider />
            <Form.Item prop="name" label="名称">
              <Input disabled />
            </Form.Item>
            <Form.Item prop="description" label="描述">
              <Input disabled />
            </Form.Item>
            <Table
              columns={vmColums}
              dataSource={this.state?.vmList}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={false}
              style={{ marginTop: '10px' }}
              ref={node => {
                this.vmTable = node
              }}
            ></Table>
          </Formx>
        )
      },
      {
        index: '2',
        content: (
          <Formx
            ref={node => {
              this.forma = node
            }}
          >
            <Form.Item
              prop="jiqun"
              label="目标集群"
              required
              rules={[required]}
              labelCol={{
                xs: { span: 24 },
                sm: { span: 3 }
              }}
              wrapperCol={{
                xs: { span: 24 },
                sm: { span: 14 }
              }}
            >
              <Selectx
                style={{ width: '80%' }}
                placeholder="请选择目标集群"
                options={this.state?.jiqunOptions}
              ></Selectx>
            </Form.Item>
            <EditTable
              dataSource={this.state?.selectedVmList}
              style={{ marginTop: '10px' }}
              onChange={data => this.getTableData(data)}
            ></EditTable>
          </Formx>
        )
      }
    ]
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.index} />
          ))}
        </Steps>
        <div style={{ margin: '16px' }}>{steps[current].content}</div>
        <div className="steps-action">
          {current == 0 && (
            <Button
              type="primary"
              disabled={this.state.disabledButton}
              onClick={() => this.next()}
            >
              下一步
            </Button>
          )}
          {current > 0 && (
            <Button
              type="primary"
              style={{ marginLeft: 8 }}
              onClick={() => this.prev()}
            >
              上一步
            </Button>
          )}
        </div>
      </div>
    )
  }

  render() {
    const modalCfg = createModalCfg({
      title: '导入虚拟机',
      width: 800,
      hasFooter: this.state.current !== 0
    })

    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        title={'导入虚拟机'}
        onOk={this.onOk}
        formItemLayout={formItemLayout}
      >
        {this.stepRender()}
      </Modalx>
    )
  }
}
