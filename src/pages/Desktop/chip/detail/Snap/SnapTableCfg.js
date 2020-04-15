import desktopApi from '@/services/desktops'
import React from 'react'
import { Icon } from 'antd'

export const columns = [
  {
    title: '快照名称',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '磁盘',
    key: 'disk',
    dataIndex: 'disk'
  },
  {
    title: '已安装软件',
    key: 'applist',
    dataIndex: 'applist'
  },
  {
    title: '描述',
    key: 'description',
    dataIndex: 'description'
  }
]
export const apiMethod = desktopApi.snapList
