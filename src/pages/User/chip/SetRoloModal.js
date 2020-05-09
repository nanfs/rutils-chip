import React from 'react'
import { Form, Input } from 'antd'
import { Modalx, Formx, Radiox, Title, Treex } from '@/components'
import { getUserId } from '@/utils/checkPermissions'
import userApi from '@/services/user'
import { required } from '@/utils/valid'
import SetRoleTree from './SetRoleTree'

const { createModalCfg } = Modalx

export default class setRoleModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  state = {
    checkedNodes: []
  }

  pop = data => {
    this.modal.show()
    const { id, roleId } = data
    this.modal.form.setFieldsValue({
      id,
      roleId: roleId || 'default'
    })
    this.resourceTreex.clean()
    this.setState({ checkedNodes: [] })
    this.resourceTreex.getTreeData(getUserId('userId'))
  }

  setRole = values => {
    const data = this.state.checkedNodes.map(item => {
      return {
        userId: values.id,
        roleType: values.roleId,
        objectId: item.props['data-key'],
        ObjectType: parseInt(item.props.type, 10)
      }
    })
    console.log(data)
    userApi
      .setRole({ data })
      .then(res => {
        this.modal.afterSubmit(res)
      })
      .catch(errors => {
        this.modal.break(errors)
      })
  }

  onCheck = (checkedKeys, node) => {
    this.setState({
      checkedNodes: node?.checkedNodes
    })
  }

  selectChange = () => {
    this.forceUpdate()
  }

  render() {
    const modalCfg = createModalCfg({ title: '分配角色', width: 800 })
    return (
      <Modalx
        onRef={ref => {
          this.modal = ref
        }}
        onOk={values => {
          this.setRole(values)
        }}
        modalCfg={modalCfg}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
      >
        <Formx
          onRef={ref => {
            this.form = ref
          }}
        >
          <Form.Item prop="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item prop="roleId" label="角色" required rules={[required]}>
            <Radiox
              onChange={this.selectChange}
              options={[
                { value: '1', label: '管理员' },
                { value: '2', label: '安全员' },
                { value: '3', label: '审计员' },
                { value: 'default', label: '普通用户' }
              ]}
            />
          </Form.Item>
          <Form.Item
            prop="resourceId"
            label="资源"
            required
            hidden={
              this.modal &&
              this.modal.form &&
              this.modal.form.getFieldValue('roleId') === 'default'
            }
          >
            <SetRoleTree
              onRef={ref => {
                this.resourceTreex = ref
              }}
              userId={this.modal?.form?.getFieldValue('id')}
              apiMethod={userApi.queryResources}
              onCheck={this.onCheck}
              treeRenderSuccess={this.treeRenderSuccess}
              checkable={true}
              showSearch={false}
            ></SetRoleTree>
          </Form.Item>
        </Formx>
      </Modalx>
    )
  }
}
