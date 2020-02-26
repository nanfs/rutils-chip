import React from 'react'
import userApi from '@/services/user'
import { Icon, Popover, Tag } from 'antd'
import MyIcon from '@/components/MyIcon'

// TODO antd 样式加载问题
export const columns = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    render: (value, record) => {
      return record.firstname + record.lastname
    }
  },
  {
    title: '用户组',
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
    title: '桌面数量',
    dataIndex: 'vmcount'
  },
  {
    title: '终端数量',
    dataIndex: 'tccount'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: value => {
      return value === 1 ? (
        <span>
          <Icon
            type="check-circle"
            style={{
              color: '#0f98dc'
            }}
          />
          <span
            style={{
              display: 'inline-block',
              verticalAlign: 'top'
            }}
          >
            锁定
          </span>
        </span>
      ) : (
        <span>
          <MyIcon
            type="tc-imagelocked"
            component="svg"
            style={{
              fontSize: '20px'
              // color: value === 0 ? '#ccc' : '#1890ff'
            }}
          />
          <span
            style={{
              display: 'inline-block',
              verticalAlign: 'top',
              color: '#e80d0c'
            }}
          >
            正常
          </span>
        </span>
      )
    }
  }
]
export const apiMethod = userApi.list
