import React from 'react'
import vmgroupsApi from '@/services/vmgroups'

export const columns = [
  {
    title: () => <span title="名称">名称</span>,
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: () => <span title="桌面数量">桌面数量</span>,
    dataIndex: 'desktopNum',
    ellipsis: true
  },
  {
    title: () => <span title="创建时间">创建时间</span>,
    dataIndex: 'createTime'
  },
  {
    title: () => <span title="描述">描述</span>,
    dataIndex: 'description',
    ellipsis: true
  }
]
export const apiMethod = vmgroupsApi.list
