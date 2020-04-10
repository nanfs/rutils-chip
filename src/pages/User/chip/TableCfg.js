import React from 'react'
import userApi from '@/services/user'
import { Icon, Tag } from 'antd'
import { MyIcon } from '@/components'
import { width } from 'dom-helpers'

export const columns = [
  /* {
    title: '用户名',
    dataIndex: 'username'
  }, */
  {
    title: () => <span title="状态">状态</span>,
    dataIndex: 'status',
    width: 80,
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
    title: () => <span title="姓名">姓名</span>,
    dataIndex: 'name',
    ellipsis: true,
    render: (value, record) => {
      return <span title={value}>{value}</span>
    }
  },
  {
    title: () => <span title="组织">组织</span>,
    dataIndex: 'groupName',
    ellipsis: true
  },
  {
    title: () => <span title="角色">角色</span>,
    dataIndex: 'roleName',
    ellipsis: true
  },
  /* {
    title: '邮件',
    dataIndex: 'email'
  }, */
  {
    title: () => <span title="已分配桌面数">已分配桌面数</span>,
    dataIndex: 'vmcount',
    ellipsis: true,
    render: text => <Tag>{text}</Tag>
  },
  {
    title: () => <span title="已分配终端数">已分配终端数</span>,
    dataIndex: 'tccount',
    ellipsis: true,
    render: text => <Tag>{text}</Tag>
  }
]
export const apiMethod = userApi.list
