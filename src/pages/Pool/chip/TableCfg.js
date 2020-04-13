import poolsApi from '@/services/pools'
import React from 'react'
import { Tag } from 'antd'

export const columns = [
  {
    title: () => <span title="管理类型">管理类型</span>,
    width: 120,
    dataIndex: 'managerType',
    ellipsis: true,
    render: text => (text === 0 ? '自动' : '手动')
  },
  {
    title: () => <span title="模板">模板</span>,
    ellipsis: true,
    dataIndex: 'templateName'
  },
  {
    title: () => <span title="正在运行">正在运行</span>,
    width: 120,
    dataIndex: 'runDesktopNum',
    render: text => <Tag color="blue">{text}</Tag>
  },
  {
    title: () => <span title="预启动">预启动</span>,
    width: 120,
    dataIndex: 'prestartNum',
    render: text => <Tag color="blue">{text}</Tag>
  },
  {
    title: () => <span title="桌面总数">桌面总数</span>,
    width: 120,
    dataIndex: 'desktopNum',
    render: text => <Tag color="blue">{text}</Tag>
  },
  {
    title: () => <span title="描述">描述</span>,
    ellipsis: true,
    dataIndex: 'description'
  }
]
export const apiMethod = poolsApi.list
