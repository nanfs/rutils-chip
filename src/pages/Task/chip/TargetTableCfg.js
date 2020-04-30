import React from 'react'
import desktopsApi from '@/services/desktops'

export const columns = [
  {
    title: () => <span title="桌面名称">桌面名称</span>,
    width: 300,
    ellipsis: true,
    dataIndex: 'name'
  },
  {
    title: () => <span title="集群">集群</span>,
    width: 300,
    ellipsis: true,
    dataIndex: 'clusterName',
    filters: JSON.parse(sessionStorage.getItem('clusters'))
  },
  {
    title: () => <span title="数据中心">数据中心</span>,
    ellipsis: true,
    dataIndex: 'datacenterName',
    filters: JSON.parse(sessionStorage.getItem('datacenters'))
  }
]
export const apiMethod = desktopsApi.list
