import React from 'react'
import userApi from '@/services/user'
import { Icon } from 'antd'
// TODO antd 样式加载问题
export const detailDesktopColumns = [
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '桌面名称',
    dataIndex: 'name'
  },
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '控制台状态',
    dataIndex: 'consoleStatus'
  },
  {
    title: '上线时间',
    dataIndex: 'time'
  }
]
export const detailDesktopApiMethod = userApi.list
