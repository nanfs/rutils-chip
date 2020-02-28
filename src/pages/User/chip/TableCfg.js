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
      return (
        (record.firstname ? '' : record.firstname) +
        (record.lastname ? '' : record.lastname)
      )
    }
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
    dataIndex: 'vmcount'
  },
  {
    title: '已分配终端数',
    dataIndex: 'tccount'
  },
  {
    title: '状态',
    dataIndex: 'status',
    filters: [
      { value: 1, text: '锁定' },
      { value: 0, text: '正常' }
    ],
    render: value => {
      return value === 0 ? (
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
            &nbsp;&nbsp;正常
          </span>
        </span>
      ) : (
        <span>
          <MyIcon
            type="tc-imagelocked"
            component="svg"
            style={{
              fontSize: '18px'
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
            &nbsp;锁定
          </span>
        </span>
      )
    }
  }
]
export const apiMethod = userApi.list
