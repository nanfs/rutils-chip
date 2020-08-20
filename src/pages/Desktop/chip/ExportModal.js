import React from 'react'
import { Formx, Modalx } from '@/components'
import { Form, Checkbox, Input, message } from 'antd'
import templateApi from '@/services/template'
import desktopsApi from '@/services/desktops'

const { createModalCfg } = Modalx
export default class ExportModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      vmName: '',
      vmExistDomain: true,
      templateExistDomain: true,
      returnVmFlag: false,
      returnTempFlag: false,
      templateNameExistDomain: true
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  pop = (record, temp) => {
    this.setState({ vmName: record.name, temp, record })
    this.modal.form.setFieldsValue({ vmId: record.id })
    // 判断是否存在导出域
    desktopsApi.exportDomains({ id: record.datacenterId }).then(res => {
      if (res.data.id) {
        this.setState({ storageDomainId: res.data.id })
        if (temp) {
          // 模板是否存在于导出域
          templateApi
            .templateExistInExportDomain({
              templateName: record.name,
              storageDomainId: res.data.id,
              storagePoolId: record.datacenterId
            })
            .then(res2 => {
              if (res2.data) {
                this.modal.form.setFieldsValue({ forceOverride: true })
              }
              this.setState({ templateNameExistDomain: !res2.data })
              this.modal.show()
            })
        } else {
          // 虚拟机是否存在于导出域
          desktopsApi
            .vmExistInExportDomain({
              name: record.name,
              id: record.id,
              storagePoolId: record.datacenterId,
              storageDomainId: res.data.id
            })
            .then(res2 => {
              if (res2.data) {
                this.modal.form.setFieldsValue({ forceOverride: true })
              }
              this.setState(
                { vmExistDomain: !res2.data, returnVmFlag: true },
                () => {
                  if (this.state.returnTempFlag) {
                    this.modal.show()
                  }
                }
              )
            })
          // 虚拟机所基于的模板是否存在于导出域
          desktopsApi
            .templateExistInExportDomain({
              templateId: record.templateId,
              storagePoolId: record.datacenterId,
              storageDomainId: res.data.id
            })
            .then(res3 => {
              this.setState(
                { templateExistDomain: res3.data, returnTempFlag: true },
                () => {
                  if (this.state.returnVmFlag) {
                    this.modal.show()
                  }
                }
              )
            })
        }
      } else {
        message.error(
          '没有导出域可用来备份虚拟机。请在虚拟机的数据中心中附加导出域。'
        )
      }
    })
  }

  // 重置弹窗
  onClose = () => {
    this.setState(
      {
        vmName: '',
        vmExistDomain: true,
        templateExistDomain: true,
        returnVmFlag: false,
        returnTempFlag: false,
        templateNameExistDomain: true
      },
      () => this.modal.form.resetFields()
    )
  }

  // 导出
  onOk = values => {
    const { temp, record, storageDomainId } = this.state
    if (temp) {
      templateApi
        .export({
          templateId: record.id,
          storageDomainId,
          forceOverride: values.forceOverride ? 1 : 0
        })
        .then(res => {
          this.modal.afterSubmit(res)
        })
        .catch(error => {
          console.log(error)
          this.modal.break(error)
        })
    } else {
      desktopsApi
        .export({
          desktopId: record.id,
          storageDomainId,
          forceOverride: values.forceOverride ? 1 : 0,
          collapseSnapshots: values.collapseSnapshots ? 1 : 0
        })
        .then(res => {
          this.modal.afterSubmit(res)
        })
        .catch(error => {
          this.modal.break(error)
        })
    }
  }

  render() {
    const modalCfg = createModalCfg({
      title: this.state?.temp ? '导出模板' : '导出虚拟机'
    })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        modalCfg={modalCfg}
        onOk={this.onOk}
        onClose={this.onClose}
      >
        <Formx>
          <Form.Item prop="vmId" label="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="forceOverride" valuepropname="checked">
            <Checkbox>强制覆盖</Checkbox>
          </Form.Item>
          <Form.Item
            prop="collapseSnapshots"
            hidden={this.state.temp}
            valuepropname="checked"
          >
            <Checkbox>Collapse 快照</Checkbox>
          </Form.Item>
          <p hidden={this.state?.vmExistDomain} style={{ color: '#CD2127' }}>
            虚拟机: {this.state.vmName}{' '}
            已经存在于目标导出域中。如果您想覆盖它们，请选择
            &apos;ForceOverride&apos; 复选框。
          </p>
          <p
            hidden={this.state?.templateNameExistDomain}
            style={{ color: '#CD2127' }}
          >
            模板: {this.state.vmName}{' '}
            已经存在于目标导出域中。如果您想覆盖它们，请选择
            &apos;ForceOverride&apos; 复选框。
          </p>
          <p
            hidden={this.state?.templateExistDomain}
            style={{ color: '#CD2127' }}
          >
            虚拟机: {this.state.vmName}{' '}
            所基于的模板没有存在于导出域中，因此无法正常工作。请选择
            &apos;CollapseSnapshots&apos; 复选框或者导入模板。
          </p>
        </Formx>
      </Modalx>
    )
  }
}
