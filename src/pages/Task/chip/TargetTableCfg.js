import React from 'react'
import desktopsApi from '@/services/desktops'

export const columns = [
  {
    title: () => <span title="桌面名称">桌面名称</span>,
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: () => <span title="集群">集群</span>,
    dataIndex: 'clusterName',
    ellipsis: true,
    filters: JSON.parse(sessionStorage.getItem('clusters'))
  },
  {
    title: () => <span title="数据中心">数据中心</span>,
    dataIndex: 'datacenterName',
    ellipsis: true,
    filters: JSON.parse(sessionStorage.getItem('datacenters'))
  }
]
export const apiMethod = desktopsApi.list
