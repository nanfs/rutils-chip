import poolsApi from '@/services/pools'
import React from 'react'
import { Tag } from 'antd'
// TODO antd 样式加载问题
export const columns = [
  {
    title: '管理类型',
    width: 120,
    dataIndex: 'managerType',
    render: text => (text === 0 ? '自动' : '手动')
  },
  {
    title: '模板',
    ellipsis: true,
    dataIndex: 'templateName'
  },
  {
    title: '正在运行',
    width: 120,
    dataIndex: 'runDesktopNum',
    render: text => <Tag>{text}</Tag>
  },
  {
    title: '预启动',
    width: 120,
    dataIndex: 'prestartNum',
    render: text => <Tag>{text}</Tag>
  },
  {
    title: '桌面总数',
    width: 120,
    dataIndex: 'desktopNum',
    render: text => <Tag>{text}</Tag>
  },
  {
    title: '描述',
    ellipsis: true,
    dataIndex: 'description'
  }
]
export const apiMethod = poolsApi.list
