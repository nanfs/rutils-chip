import React from 'react'
import { Formx, Modalx, Selectx } from '@/components'
import {
  Form,
  Checkbox,
  Input,
  Divider,
  Button,
  Table,
  Steps,
  message
} from 'antd'
import templateApi from '@/services/template'
import EditTable from './EditTable'
import { required } from '@/utils/valid'
import desktopApi from '@/services/desktops'

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
  constructor(props) {
    super(props)
    this.state = {
      storagePoolOptions: [],
      storageDomainOptions: [{ label: '导出域', value: '1' }],
      clusterOptions: [],
      list: [],
      selectedList: [],
      current: 0,
      disabledButton: true,
      loading: false
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = temp => {
    this.modal.show()
    this.setState({ temp })
    // 获取数据中心列表
    desktopApi.storagePools({ available: 1 }).then(res => {
      const storagePoolOptions = res.data?.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
      this.setState({
        storagePoolOptions,
        storagePoolId: storagePoolOptions[0]?.value
      })
      this.formb.setFieldsValue({
        storagePoolId: storagePoolOptions[0]?.value,
        domain: '1'
      })
      // 获取导出域详情， 数据中心下集群列表
      this.exportDetail(storagePoolOptions[0]?.value)
      this.getClusters(storagePoolOptions[0]?.value)
    })
  }

  // 数据中心下集群列表
  getClusters(id) {
    desktopApi.getClusters({ id }).then(res => {
      const clusterOptions = res.data?.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
      this.setState({
        clusterOptions,
        clusterId: clusterOptions[0]?.value
      })
    })
  }

  // 加载源中虚拟机
  fetchVmList = () => {
    this.setState({ loading: true })
    desktopApi
      .vmListInDomain({
        storageDomainId: this.state.storageDomainId,
        storagePoolId: this.state.storagePoolId
      })
      .then(res => {
        this.setState({
          list: res.data,
          selection: [],
          selectData: [],
          selectedList: [],
          disabledButton: true,
          loading: false
        })
      })
      .catch(err => {
        this.setState({ loading: false })
      })
  }

  // 加载导出域下模板列表
  fetchTemplateList = () => {
    this.setState({ loading: true })
    templateApi
      .templateListInDomain({
        storageDomainId: this.state.storageDomainId,
        storagePoolId: this.state.storagePoolId
      })
      .then(res => {
        this.setState({
          list: res.data,
          selection: [],
          selectData: [],
          selectedList: [],
          disabledButton: true,
          loading: false
        })
      })
      .catch(err => {
        this.setState({ loading: false })
      })
  }

  // 导出域详情
  exportDetail(id) {
    desktopApi.exportDomains({ id }).then(res => {
      this.formb.setFieldsValue({
        name: res.data.name,
        description: res.data.description
      })
      this.setState({
        storageDomainId: res.data.id,
        name: res.data.name,
        description: res.data.description
      })
      if (this.state.temp) {
        this.fetchTemplateList()
      } else {
        this.fetchVmList()
      }
    })
  }

  // 表格选项勾选 支持单条导入
  onSelectChange = (selectKeys, selectData) => {
    if (selectKeys.length > 1) {
      message.warning('仅支持单条导入')
      return
    }
    this.setState({
      selection: selectKeys,
      selectData,
      selectedList: selectData
    })
    if (selectKeys.length !== 1) {
      this.setState({ disabledButton: true })
    } else {
      this.setState({ disabledButton: false })
    }
  }

  // 数据中心切换事件
  storagePoolChange = (a, b, data) => {
    this.setState({
      storagePoolId: data
    })
    this.exportDetail(data)
    this.getClusters(data)
  }

  storageDomainChange = (a, b, data) => {
    this.setState({
      storageDomainId: data
    })
    if (this.state.selectData?.length) {
      this.setState({ disabledButton: false })
    } else {
      this.setState({ disabledButton: true })
    }
  }

  // 集群切换
  clusterChange = (a, b, data) => {
    this.setState({
      clusterId: data
    })
  }

  // 关闭窗口 重置弹窗
  onClose = () => {
    this.setState(
      {
        storagePoolOptions: [],
        storageDomainOptions: [{ label: '导出域', value: '1' }],
        clusterOptions: [],
        list: [],
        selectedList: [],
        current: 0,
        disabledButton: true,
        loading: false
      },
      () => {
        this.formb.resetFields()
      }
    )
  }

  // 导入 判断名称重名
  onOk = () => {
    const {
      selectData,
      selectedList,
      temp,
      clusterId,
      storageDomainId,
      storagePoolId,
      nameStatus
    } = this.state
    if (nameStatus && selectData[0].name === selectedList[0].name) {
      message.error('名称在环境中已被使用，创建一个新名称')
      return 'noLoading'
    }
    if (temp) {
      templateApi
        .import({
          templateId: selectedList[0].id,
          templateName: selectedList[0].name,
          clusterId,
          storagePoolId,
          storageDomainId
        })
        .then(res => {
          this.onClose()
          this.modal.afterSubmit(res)
        })
        .catch(error => {
          console.log(error)
          this.modal.break(error)
        })
    } else {
      desktopApi
        .import({
          id: selectedList[0].id,
          name: selectedList[0].name,
          clusterId,
          storagePoolId,
          storageDomainId
        })
        .then(res => {
          this.onClose()
          this.modal.afterSubmit(res)
        })
        .catch(error => {
          console.log(error)
          this.modal.break(error)
        })
    }
  }

  // 判断名称是否存在于系统
  next() {
    const { clusterId, selectData } = this.state
    this.setState({ current: this.state.current + 1 }, () =>
      this.forma.setFieldsValue({ clusterId })
    )
    if (this.state.temp) {
      templateApi
        .templateExistInSystem({
          baseTemplateId: selectData[0].baseTemplateId,
          id: selectData[0].id,
          name: selectData[0].name,
          storagePoolId: this.state.storagePoolId
        })
        .then(res => {
          const list = this.state.selectData[0]
          if (res.data) {
            list.nameStatus = true
            this.setState({
              selectData: [list],
              nameStatus: res.data
            })
          } else {
            list.nameStatus = false
            this.setState({
              selectData: [list],
              nameStatus: res.data
            })
          }
        })
    } else {
      desktopApi
        .vmExistInSystem({
          name: selectData[0].name,
          id: selectData[0].id,
          storagePoolId: this.state.storagePoolId
        })
        .then(res => {
          const list = this.state.selectData[0]
          if (res.data) {
            list.nameStatus = true
            this.setState({
              selectData: [list]
            })
          } else {
            list.nameStatus = false
            this.setState({
              selectData: [list]
            })
          }
        })
    }
  }

  prev() {
    const { storagePoolId, name, description } = this.state
    this.setState({ current: this.state.current - 1 }, () =>
      this.formb.setFieldsValue({
        storagePoolId,
        name,
        description,
        domain: '1'
      })
    )
  }

  // 表格编辑之后获取新数据
  getTableData(data) {
    this.setState({ selectedList: data })
  }

  // 步骤条渲染
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
            <Form.Item prop="storagePoolId" label="数据中心">
              <Selectx
                placeholder="请选择数据中心"
                options={this.state?.storagePoolOptions}
                onChange={this.storagePoolChange}
              ></Selectx>
            </Form.Item>
            <Form.Item label="源" prop="domain">
              <Selectx
                disabled
                placeholder="请选择源"
                options={this.state?.storageDomainOptions}
                // onChange={this.storageDomainChange}
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
              dataSource={this.state?.list}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={false}
              loading={this.state.loading}
              style={{
                marginTop: '10px',
                maxHeight: '400px',
                overflow: 'auto'
              }}
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
              prop="clusterId"
              label="目标集群"
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
                options={this.state?.clusterOptions}
                onChange={this.clusterChange}
              ></Selectx>
            </Form.Item>
            <EditTable
              dataSource={this.state?.selectedList}
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
              className="prev-btn"
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
      title: this.state?.temp ? '导入模板' : '导入虚拟机',
      width: 800,
      hasFooter: this.state.current !== 0
    })

    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
        onClose={this.onClose}
        formItemLayout={formItemLayout}
      >
        {this.stepRender()}
      </Modalx>
    )
  }
}
