import poolsApi from '@/services/pools'
import React from 'react'
import { Icon, Progress } from 'antd'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '状态',
    dataIndex: 'name'
  },
  {
    title: '管理类型',
    dataIndex: 'manageType',
    filters: [
      {
        text: '1',
        value: '1'
      },
      {
        text: '3',
        value: '3'
      }
    ],
    render: text => (text === 0 ? '自动' : '手动')
  },
  {
    title: '模板',
    dataIndex: 'templateName'
  },
  {
    title: '正在运行',
    dataIndex: 'runDesktopNum'
  },
  {
    title: '预启动',
    dataIndex: 'prestartNum'
  },
  {
    title: '桌面总数',
    dataIndex: 'desktopNum'
  },
  {
    title: '描述',
    dataIndex: 'description'
  }
]
export const apiMethod = poolsApi.list
