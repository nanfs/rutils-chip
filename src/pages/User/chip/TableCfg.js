import React from 'react'
import userApi from '@/services/user'
import { Icon } from 'antd'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '用户组',
    dataIndex: 'groupName'
  },
  {
    title: '角色',
    dataIndex: 'roleName'
  },
  {
    title: '邮件',
    dataIndex: 'email'
  },
  {
    title: '桌面数量',
    dataIndex: 'desktopNumber'
  },
  {
    title: '终端数量',
    dataIndex: 'terminalNumber'
  },
  {
    title: '状态',
    dataIndex: 'status'
  }
]
export const apiMethod = userApi.list
