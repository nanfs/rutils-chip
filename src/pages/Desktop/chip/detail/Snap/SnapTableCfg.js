import desktopApi from '@/services/desktops'
import React from 'react'
import { Icon } from 'antd'

export const columns = [
  {
    title: '描述',
    key: 'description',
    dataIndex: 'description'
  },
  {
    title: 'CPU',
    key: 'cpu',
    dataIndex: 'cpu'
  },
  {
    title: '内存',
    key: 'memSize',
    dataIndex: 'memSize',
    render: text => `${text}G`
  },
  {
    title: '已安装程序',
    key: 'appList',
    dataIndex: 'appList'
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime'
  }
]
export const apiMethod = desktopApi.snapList
