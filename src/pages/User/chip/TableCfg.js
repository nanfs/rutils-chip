import React from 'react'
import userApi from '@/services/user'
import { Icon, Tag } from 'antd'
import { MyIcon } from '@/components'

export const columns = [
  /* {
    title: '用户名',
    dataIndex: 'username'
  }, */
  {
    title: '状态',
    dataIndex: 'status',
    // defaultFilteredValue: ['0', '1'],
    filters: [
      { value: '1', text: '禁用' },
      { value: '0', text: '正常' }
    ],
    render: value => {
      return value === 0 ? (
        <span>
          <Icon
            type="check-circle"
            style={{
              color: '#85da47'
            }}
            title="正常"
          />
          {/* <span
            style={{
              display: 'inline-block',
              verticalAlign: 'top'
            }}
          >
            &nbsp;&nbsp;正常
          </span> */}
        </span>
      ) : (
        <span>
          <Icon
            type="stop"
            title="禁用"
            style={{
              color: '#ff4d4f'
            }}
          />
          {/* <span
            style={{
              display: 'inline-block',
              verticalAlign: 'top',
              color: '#e80d0c'
            }}
          >
            &nbsp;禁用
          </span> */}
        </span>
      )
    }
  },
  {
    title: '姓名',
    dataIndex: 'name'
    /* render: (value, record) => {
      return (
        (record.firstname === null ? '' : record.firstname) +
        (record.lastname === null ? '' : record.lastname)
      )
    } */
  },
  {
    title: '组织',
    dataIndex: 'groupName'
  },
  {
    title: '角色',
    dataIndex: 'roleName'
  },
  /* {
    title: '邮件',
    dataIndex: 'email'
  }, */
  {
    title: '已分配桌面数',
    dataIndex: 'vmcount',
    render: text => <Tag>{text}</Tag>
  },
  {
    title: '已分配终端数',
    dataIndex: 'tccount',
    render: text => <Tag>{text}</Tag>
  }
]
export const apiMethod = userApi.list
