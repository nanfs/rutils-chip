import React from 'react'
import { Form, Input } from 'antd'
import { Modalx, Formx, Radiox, Title, Treex, message } from '@/components'
import { getUserId, getRole } from '@/utils/checkPermissions'
import userApi from '@/services/user'
import { required } from '@/utils/valid'
import SetRoleTree from './SetRoleTree'

const { createModalCfg } = Modalx

export default class setRoleModal extends React.Component {
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.setState({
      rolesArray: JSON.parse(sessionStorage.getItem('roles'))
    })
  }

  checkFieldRequired() {
    return (rule, value, callback) => {
      const roleId = this.modal.form.getFieldValue('roleId')
      if (roleId !== '2' && !value) {
        callback(new Error('请至少选择一个资源'))
      }
      callback()
    }
  }

  state = {
    rolesArray: [],
    checkedNodes: [],
    checkedKeys: [],
    sqlSaveNodes: []
  }

  pop = data => {
    this.modal.show()
    const { id, roleTypeId } = data
    this.modal.form.setFieldsValue({
      id,
      roleId: roleTypeId || '2'
    })
    this.resourceTreex.clean()
    userApi
      .queryUserResources({ userId: id })
      .then(response => {
        if (response.success) {
          const checkedNodes = []
          const checkedKeys = []
          response.data.forEach(item => {
            item.key = item.object_id
            item.type = item.object_type_id
            item.permissionId = item.id
            checkedNodes.push(item)
            checkedKeys.push(item.key)
          })
          userApi
            .queryUserResources({ userId: getUserId('userId') })
            .then(res => {
              const loginUserResource = []
              if (res.success) {
                res.data.forEach(item => {
                  item.key = item.object_id
                  loginUserResource.push(item.key)
                })
                this.setState({
                  checkedNodes,
                  checkedKeys,
                  sqlSaveNodes: checkedNodes,
                  sqlSaveRoleId: roleTypeId
                })
                this.resourceTreex.getTreeData(
                  getUserId('userId'),
                  checkedKeys,
                  loginUserResource
                )
              }
            })
            .catch(error => {
              message.error(error.message || error)
            })
        }
      })
      .catch(error => {
        message.error(error.message || error)
      })
  }

  setRole = values => {
    const addData = []
    const removeData = []
    const addKeys = []
    this.state.checkedNodes.forEach(item => {
      addData.push({
        userId: values.id,
        roleType: parseInt(values.roleId, 10),
        objectId: item.key,
        objectType: item.type
      })
      addKeys.push(item.key)
    })
    this.state.sqlSaveNodes.forEach(ele => {
      if (addKeys.indexOf(ele.key) === -1) {
        removeData.push({
          userId: values.id,
          roleType: parseInt(values.roleId, 10),
          objectId: ele.key,
          objectType: ele.type,
          permissionId: ele.permissionId
        })
      }
    })
    console.log(addData, removeData)
    if (values.roleId === '2') {
      userApi
        .ordinaryUser({ userId: values.id })
        .then(res => {
          this.modal.afterSubmit(res)
        })
        .catch(errors => {
          this.modal.break(errors)
        })
    } else if (
      this.state.sqlSaveRoleId !== '2' &&
      values.roleId !== this.state.sqlSaveRoleId
    ) {
      userApi
        .ordinaryUser({ userId: values.id })
        .then(res => {
          if (res.success) {
            addData.length > 0 &&
              userApi
                .setRole(addData)
                .then(response => {
                  this.modal.afterSubmit(response)
                })
                .catch(errors => {
                  this.modal.break(errors)
                })
          }
        })
        .catch(errors => {
          this.modal.break(errors)
        })
    } else {
      addData.length > 0 &&
        userApi
          .setRole(addData)
          .then(res => {
            this.modal.afterSubmit(res)
          })
          .catch(errors => {
            this.modal.break(errors)
          })
      removeData.length > 0 &&
        userApi
          .removeRole(removeData)
          .then(res => {
            this.modal.afterSubmit(res)
          })
          .catch(errors => {
            this.modal.break(errors)
          })
    }
  }

  onCheck = (checkedKeys, node) => {
    const checkedNodes = node?.checkedNodes.map(item => {
      return {
        key: item.props['data-key'],
        type: parseInt(item.props.type, 10)
      }
    })
    this.setState({
      checkedNodes
    })
    this.modal.form.setFieldsValue({
      resourceId: checkedNodes
    })
  }

  selectChange = () => {
    this.forceUpdate()
  }

  render() {
    const modalCfg = createModalCfg({ title: '分配权限', width: 800 })
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
              options={this.state.rolesArray}
            />
          </Form.Item>
          <Form.Item
            prop="resourceId"
            label="资源"
            required
            rules={[this.checkFieldRequired()]}
            hidden={
              this.modal &&
              this.modal.form &&
              this.modal.form.getFieldValue('roleId') === '2'
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
